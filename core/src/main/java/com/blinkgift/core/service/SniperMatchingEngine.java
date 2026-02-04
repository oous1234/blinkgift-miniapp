package com.blinkgift.core.service;

import com.blinkgift.core.client.BotInternalClient;
import com.blinkgift.core.domain.UserFilterDocument;
import com.blinkgift.core.dto.ListingEvent;
import com.blinkgift.core.dto.SniperNotificationDto;
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
    private final BotInternalClient botInternalClient; // Добавили клиент бота

    @Getter
    private final Map<String, UserFilterDocument> filterCache = new ConcurrentHashMap<>();

    @PostConstruct
    public void init() {
        refreshCache();
    }

    public void refreshCache() {
        log.info("Refreshing sniper filters cache...");
        List<UserFilterDocument> allFilters = mongoTemplate.findAll(UserFilterDocument.class);
        filterCache.clear();
        allFilters.forEach(f -> filterCache.put(f.getUserId(), f));
        log.info("Loaded {} user filters into memory", filterCache.size());
    }

    public void updatePlayerFilter(UserFilterDocument filter) {
        filterCache.put(filter.getUserId(), filter);
    }

    public void processNewListing(ListingEvent gift) {
        filterCache.values().parallelStream().forEach(filter -> {
            if (isMatch(gift, filter)) {
                sendToUser(filter.getUserId(), gift);
            }
        });
    }

    private boolean isMatch(ListingEvent gift, UserFilterDocument filter) {
        if (filter.getMaxPrice() != null && gift.getPrice().compareTo(filter.getMaxPrice()) > 0) {
            return false;
        }
        if (filter.getModels() != null && !filter.getModels().isEmpty()) {
            if (!filter.getModels().contains(gift.getModel())) return false;
        }
        if (filter.getBackdrops() != null && !filter.getBackdrops().isEmpty()) {
            if (!filter.getBackdrops().contains(gift.getBackdrop())) return false;
        }
        return true;
    }

    private void sendToUser(String userId, ListingEvent gift) {
        log.debug("🎯 Match found for user {}! Gift: {}", userId, gift.getName());

        // 1. Отправка в WebSocket (Mini App)
        try {
            messagingTemplate.convertAndSendToUser(
                    userId,
                    "/queue/sniper",
                    gift
            );
        } catch (Exception e) {
            log.error("WS error: {}", e.getMessage());
        }

        // 2. Отправка уведомления в Telegram бот
        try {
            SniperNotificationDto notification = SniperNotificationDto.builder()
                    .userId(Long.parseLong(userId))
                    .giftName(gift.getName())
                    .model(gift.getModel() != null ? gift.getModel() : "Original")
                    .price(gift.getPrice().toString())
                    .marketplace(gift.getMarketplace())
                    .build();

            botInternalClient.notifyBot(notification);
            log.info("✅ Bot notification sent for user {}", userId);
        } catch (Exception e) {
            log.error("❌ Failed to notify Bot for user {}: {}", userId, e.getMessage());
        }
    }
}