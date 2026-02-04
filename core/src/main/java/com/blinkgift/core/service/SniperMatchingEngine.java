package com.blinkgift.core.service;

import com.blinkgift.core.domain.UserFilterDocument;
import com.blinkgift.core.dto.ListingEvent;
import jakarta.annotation.PostConstruct;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Service
@RequiredArgsConstructor
public class SniperMatchingEngine {
    private final MongoTemplate mongoTemplate;
    private final SimpMessagingTemplate messagingTemplate;

    // Кэш фильтров в памяти: UserId -> Настройки
    @Getter
    private final Map<String, UserFilterDocument> filterCache = new ConcurrentHashMap<>();

    @PostConstruct
    public void init() {
        refreshCache();
    }

    // Выгружаем все фильтры из базы в память при старте
    public void refreshCache() {
        log.info("Refreshing sniper filters cache...");
        List<UserFilterDocument> allFilters = mongoTemplate.findAll(UserFilterDocument.class);
        filterCache.clear();
        allFilters.forEach(f -> filterCache.put(f.getUserId(), f));
        log.info("Loaded {} user filters into memory", filterCache.size());
    }

    // Обновить фильтр конкретного юзера (вызывается при сохранении настроек)
    public void updatePlayerFilter(UserFilterDocument filter) {
        filterCache.put(filter.getUserId(), filter);
    }

    // САМАЯ ВАЖНАЯ ФУНКЦИЯ: Матчинг
    public void processNewListing(ListingEvent gift) {
        // Пробегаем по всем активным фильтрам (через параллельный стрим для скорости)
        filterCache.values().parallelStream().forEach(filter -> {
            if (isMatch(gift, filter)) {
                sendToUser(filter.getUserId(), gift);
            }
        });
    }

    private boolean isMatch(ListingEvent gift, UserFilterDocument filter) {
        // 1. Фильтр по цене
        if (filter.getMaxPrice() != null && gift.getPrice().compareTo(filter.getMaxPrice()) > 0) {
            return false;
        }

        // 2. Фильтр по модели (если список не пуст)
        if (filter.getModels() != null && !filter.getModels().isEmpty()) {
            if (!filter.getModels().contains(gift.getModel())) return false;
        }

        // 3. Фильтр по фону
        if (filter.getBackdrops() != null && !filter.getBackdrops().isEmpty()) {
            if (!filter.getBackdrops().contains(gift.getBackdrop())) return false;
        }

        return true;
    }

    private void sendToUser(String userId, ListingEvent gift) {
        log.debug("🎯 Match found for user {}! Gift: {}", userId, gift.getName());

        // Отправка в персональный WebSocket канал юзера
        messagingTemplate.convertAndSendToUser(
                userId,
                "/queue/sniper",
                gift
        );

        // Здесь же в будущем будет вызов Telegram Bot Service
    }
}