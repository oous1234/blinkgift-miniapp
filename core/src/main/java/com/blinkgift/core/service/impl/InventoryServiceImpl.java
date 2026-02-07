package com.blinkgift.core.service.impl;

import com.blinkgift.core.client.PythonGatewayClient;
import com.blinkgift.core.domain.UserInventoryDocument;
import com.blinkgift.core.domain.UserSyncStateDocument;
import com.blinkgift.core.dto.external.PythonInventoryResponse;
import com.blinkgift.core.dto.resp.InventoryResponse;
import com.blinkgift.core.repository.UserInventoryRepository;
import com.blinkgift.core.repository.UserSyncStateRepository;
import com.blinkgift.core.service.InventoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import java.time.Duration;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class InventoryServiceImpl implements InventoryService {

    private final PythonGatewayClient pythonClient;
    private final UserInventoryRepository inventoryRepository;
    private final UserSyncStateRepository syncStateRepository;
    private final RedisTemplate<String, Object> redisTemplate;
    private final DiscoveryTaskPublisher discoveryTaskPublisher; // Сервис для отправки задачи в Redis Stream

    private static final String REDIS_INV_PREFIX = "inv:cache:";

    @Override
    public InventoryResponse getUserInventory(String userId, int limit, int offset) {
        // Логика для первой страницы (offset 0)
        if (offset == 0) {
            String cacheKey = REDIS_INV_PREFIX + userId;
            InventoryResponse cached = (InventoryResponse) redisTemplate.opsForValue().get(cacheKey);

            if (cached != null) {
                log.debug("Returning cached first page for user: {}", userId);
                return cached;
            }

            // Если в кэше нет, делаем быстрый запрос в Python (Cold Start)
            PythonInventoryResponse live = pythonClient.getInventoryLive(userId, "", limit);

            // Сохраняем "скелеты" в локальную БД для возможности последующей фильтрации
            persistInventorySkeletons(userId, live.getItems());

            // Создаем ответ
            InventoryResponse response = mapToResponse(live, offset, limit);

            // Кэшируем первую страницу на 5 минут для мгновенных повторных входов
            redisTemplate.opsForValue().set(cacheKey, response, Duration.ofMinutes(5));

            // Триггерим фоновую задачу для Discovery Service
            discoveryTaskPublisher.publishDiscoveryTask(userId, live.getTotal_count());

            return response;
        }

        // Для страниц > 1 (пагинация) — прямой проброс без кэширования всей БД
        // В реальном проекте здесь можно добавить логику проверки:
        // если Discovery уже все выкачал, брать из БД, если нет — из Python.
        PythonInventoryResponse livePage = pythonClient.getInventoryLive(userId, String.valueOf(offset), limit);
        return mapToResponse(livePage, offset, limit);
    }

    @Override
    public PythonInventoryResponse fetchLivePage(String userId, int limit, String offsetCursor) {
        return pythonClient.getInventoryLive(userId, offsetCursor, limit);
    }

    private void persistInventorySkeletons(String userId, List<PythonInventoryResponse.InventoryItem> items) {
        List<UserInventoryDocument> docs = items.stream().map(item ->
                UserInventoryDocument.builder()
                        .id(item.getGift_id())
                        .userId(userId)
                        .slug(item.getSlug())
                        .serialNumber(item.getSerial_number())
                        .acquiredAt(item.getDate())
                        .build()
        ).collect(Collectors.toList());
        inventoryRepository.saveAll(docs);
    }

    private InventoryResponse mapToResponse(PythonInventoryResponse live, int offset, int limit) {
        // Маппинг в DTO для фронтенда
        return InventoryResponse.builder()
                .items(live.getItems().stream().map(this::mapItem).collect(Collectors.toList()))
                .total(live.getTotal_count())
                .offset(offset)
                .limit(limit)
                .build();
    }

    private InventoryResponse.GiftItemDto mapItem(PythonInventoryResponse.InventoryItem item) {
        return InventoryResponse.GiftItemDto.builder()
                .id(item.getGift_id())
                .slug(item.getSlug())
                .serialNumber(item.getSerial_number())
                .image("https://nft.fragment.com/gift/" + item.getSlug().toLowerCase() + ".medium.jpg")
                .build();
    }
}