package com.blinkgift.core.service.impl;

import com.blinkgift.core.client.PythonGatewayClient;
import com.blinkgift.core.domain.UserInventoryDocument;
import com.blinkgift.core.domain.UserSyncStateDocument;
import com.blinkgift.core.dto.external.PythonInventoryResponse;
import com.blinkgift.core.dto.resp.InventoryResponse;
import com.blinkgift.core.repository.UserInventoryRepository;
import com.blinkgift.core.repository.UserSyncStateRepository;
import com.blinkgift.core.service.InventoryService;
import com.blinkgift.core.service.DiscoveryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class InventoryServiceImpl implements InventoryService {

    private final PythonGatewayClient pythonClient;
    private final UserInventoryRepository inventoryRepository;
    private final UserSyncStateRepository syncStateRepository;
    private final DiscoveryService discoveryService;

    @Override
    @Transactional
    public InventoryResponse getUserInventory(String userId, String tgAuth, int limit, int offset) {
        log.debug("Inventory request for user: {}, offset: {}, limit: {}", userId, offset, limit);

        UserSyncStateDocument syncState = syncStateRepository.findById(userId)
                .orElseGet(() -> initializeSyncState(userId));

        if (!Boolean.TRUE.equals(syncState.getIsFullScanCompleted()) &&
                (syncState.getStatus() == UserSyncStateDocument.SyncStatus.PENDING ||
                        syncState.getStatus() == UserSyncStateDocument.SyncStatus.FAILED) &&
                offset == 0) {

            return performColdStart(userId, limit, offset, syncState);
        }

        return getFromLocalDb(userId, limit, offset, syncState);
    }

    private InventoryResponse performColdStart(String userId, int limit, int offset, UserSyncStateDocument syncState) {
        try {
            log.info("Performing cold start sync for user: {}", userId);

            // Синхронный запрос в Python за первой пачкой
            PythonInventoryResponse liveData = pythonClient.getInventoryLive(userId, "", limit);

            // Сохраняем полученные данные в БД
            List<UserInventoryDocument> docs = liveData.getItems().stream()
                    .map(item -> mapToEntity(userId, item))
                    .collect(Collectors.toList());
            inventoryRepository.saveAll(docs);

            // Обновляем состояние
            syncState.setStatus(UserSyncStateDocument.SyncStatus.IN_PROGRESS);
            syncState.setTotalItemsCount(liveData.getTotal_count());
            syncState.setLastCursor(liveData.getNext_offset());
            syncState.setLastSyncAt(Instant.now());
            syncStateRepository.save(syncState);

            // 4. Инициируем фоновую докачку
            discoveryService.triggerInventorySync(userId, liveData.getNext_offset());

            return mapToResponse(docs, liveData.getTotal_count(), limit, offset, syncState);

        } catch (Exception e) {
            log.error("Cold start failed for user {}: {}", userId, e.getMessage());
            syncState.setStatus(UserSyncStateDocument.SyncStatus.FAILED);
            syncStateRepository.save(syncState);
            return mapToEmptyResponse(limit, offset, syncState);
        }
    }

    private InventoryResponse getFromLocalDb(String userId, int limit, int offset, UserSyncStateDocument syncState) {
        long totalInDb = inventoryRepository.countByUserId(userId);

        // Пагинация в Mongo
        var pageable = PageRequest.of(offset / limit, limit, Sort.by(Sort.Direction.DESC, "acquiredAt"));
        List<UserInventoryDocument> items = inventoryRepository.findByUserId(userId, pageable);

        // В качестве общего количества отдаем число из syncState (сколько всего в Telegram)
        int totalExpected = syncState.getTotalItemsCount() != null ? syncState.getTotalItemsCount() : (int) totalInDb;

        return mapToResponse(items, totalExpected, limit, offset, syncState);
    }

    private UserSyncStateDocument initializeSyncState(String userId) {
        UserSyncStateDocument state = UserSyncStateDocument.builder()
                .userId(userId)
                .status(UserSyncStateDocument.SyncStatus.PENDING)
                .isFullScanCompleted(false)
                .lastSyncAt(Instant.now())
                .build();
        return syncStateRepository.save(state);
    }

    private UserInventoryDocument mapToEntity(String userId, PythonInventoryResponse.InventoryItem item) {
        return UserInventoryDocument.builder()
                .id(item.getGift_id())
                .userId(userId)
                .slug(item.getSlug())
                .serialNumber(item.getSerial_number())
                .acquiredAt(item.getDate())
                .name("Gift #" + item.getSerial_number())
                .build();
    }

    private InventoryResponse mapToResponse(List<UserInventoryDocument> items, int total,
                                            int limit, int offset, UserSyncStateDocument syncState) {
        List<InventoryResponse.GiftItemDto> dtos = items.stream()
                .map(this::mapToGiftItemDto)
                .collect(Collectors.toList());

        return InventoryResponse.builder()
                .items(dtos)
                .total(total)
                .limit(limit)
                .offset(offset)
                .sync(InventoryResponse.SyncStatusDto.builder()
                        .status(syncState.getStatus())
                        .isFullScanCompleted(syncState.getIsFullScanCompleted())
                        .totalItemsInTelegram(syncState.getTotalItemsCount())
                        .lastSyncAt(syncState.getLastSyncAt().toString())
                        .build())
                .build();
    }

    private InventoryResponse.GiftItemDto mapToGiftItemDto(UserInventoryDocument doc) {
        return InventoryResponse.GiftItemDto.builder()
                .id(doc.getId())
                .slug(doc.getSlug())
                .name(doc.getName())
                .serialNumber(doc.getSerialNumber())
                .acquiredAt(doc.getAcquiredAt().toString())
                .image("https://nft.fragment.com/gift/" + doc.getSlug().toLowerCase() + ".medium.jpg")
                .build();
    }

    private InventoryResponse mapToEmptyResponse(int limit, int offset, UserSyncStateDocument state) {
        return InventoryResponse.builder()
                .items(List.of())
                .total(0)
                .limit(limit)
                .offset(offset)
                .sync(InventoryResponse.SyncStatusDto.builder()
                        .status(state.getStatus())
                        .isFullScanCompleted(state.getIsFullScanCompleted() != null ? state.getIsFullScanCompleted() : false)
                        .build())
                .build();
    }

    @Override
    public UserSyncStateDocument getSyncStatus(String userId) {
        return syncStateRepository.findById(userId).orElse(null);
    }
}