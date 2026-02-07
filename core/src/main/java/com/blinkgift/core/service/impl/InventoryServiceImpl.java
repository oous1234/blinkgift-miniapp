package com.blinkgift.core.service.impl;

import com.blinkgift.core.client.PythonGatewayClient;
import com.blinkgift.core.domain.UserSyncStateDocument;
import com.blinkgift.core.dto.external.PythonInventoryResponse;
import com.blinkgift.core.dto.resp.InventoryResponse;
import com.blinkgift.core.repository.UserInventoryRepository;
import com.blinkgift.core.repository.UserSyncStateRepository;
import com.blinkgift.core.service.DiscoveryTaskPublisher;
import com.blinkgift.core.service.InventoryService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class InventoryServiceImpl implements InventoryService {

    private final PythonGatewayClient pythonClient;
    private final UserSyncStateRepository syncStateRepository;
    private final RedisTemplate<String, Object> redisTemplate;
    private final DiscoveryTaskPublisher discoveryTaskPublisher;
    private final ObjectMapper objectMapper;

    private static final String REDIS_INV_PREFIX = "inv:cache:";

    @Override
    public InventoryResponse getUserInventory(String userId, int limit, int offset) {
        // 1. Получаем текущий статус синхронизации из БД
        UserSyncStateDocument syncState = syncStateRepository.findById(userId)
                .orElseGet(() -> initializeSyncState(userId));

        // 2. Логика для первой страницы с кэшированием
        if (offset == 0) {
            String cacheKey = REDIS_INV_PREFIX + userId;
            Object cachedData = redisTemplate.opsForValue().get(cacheKey);

            if (cachedData != null) {
                try {
                    InventoryResponse response = objectMapper.convertValue(cachedData, InventoryResponse.class);
                    // Обновляем статус в кэшированном ответе свежими данными из БД
                    response.setSync(mapSyncStatus(syncState));
                    return response;
                } catch (Exception e) {
                    log.error("Failed to convert cache for user: {}", userId);
                }
            }

            // Cold Start: Запрос первой пачки
            log.info("Cold start for user: {}", userId);
            PythonInventoryResponse live = pythonClient.getInventoryLive(userId, "", limit);

            // Если это новый юзер (PENDING), ставим его в очередь на Discovery
            if (syncState.getStatus() == UserSyncStateDocument.SyncStatus.PENDING) {
                discoveryTaskPublisher.publishDiscoveryTask(userId, live.getTotal_count());
                syncState.setStatus(UserSyncStateDocument.SyncStatus.IN_PROGRESS);
                syncState.setTotalItemsCount(live.getTotal_count());
                syncStateRepository.save(syncState);
            }

            InventoryResponse response = mapToResponse(live, offset, limit, syncState);
            redisTemplate.opsForValue().set(cacheKey, response, Duration.ofMinutes(5));
            return response;
        }

        // 3. Deep paging (прямой проброс)
        PythonInventoryResponse livePage = pythonClient.getInventoryLive(userId, String.valueOf(offset), limit);
        return mapToResponse(livePage, offset, limit, syncState);
    }

    private UserSyncStateDocument initializeSyncState(String userId) {
        UserSyncStateDocument newState = UserSyncStateDocument.builder()
                .userId(userId)
                .status(UserSyncStateDocument.SyncStatus.PENDING)
                .isFullScanCompleted(false)
                .lastSyncAt(Instant.now())
                .build();
        return syncStateRepository.save(newState);
    }

    private InventoryResponse mapToResponse(PythonInventoryResponse live, int offset, int limit, UserSyncStateDocument syncState) {
        return InventoryResponse.builder()
                .items(live.getItems().stream().map(item ->
                        InventoryResponse.GiftItemDto.builder()
                                .id(item.getGift_id())
                                .slug(item.getSlug())
                                .serialNumber(item.getSerial_number())
                                .image("https://nft.fragment.com/gift/" + item.getSlug().toLowerCase() + ".medium.jpg")
                                .build()
                ).collect(Collectors.toList()))
                .total(live.getTotal_count())
                .offset(offset)
                .limit(limit)
                .sync(mapSyncStatus(syncState)) // <--- ВОТ ЗДЕСЬ МЫ ЕГО ИСПОЛЬЗУЕМ
                .build();
    }

    private InventoryResponse.SyncStatusDto mapSyncStatus(UserSyncStateDocument state) {
        return InventoryResponse.SyncStatusDto.builder()
                .status(state.getStatus())
                .fullScanCompleted(Boolean.TRUE.equals(state.getIsFullScanCompleted()))
                .totalItemsInTelegram(state.getTotalItemsCount())
                .lastSyncAt(state.getLastSyncAt() != null ? state.getLastSyncAt().toString() : null)
                .build();
    }

    @Override
    public UserSyncStateDocument getSyncStatus(String userId) {
        return syncStateRepository.findById(userId).orElse(null);
    }
}