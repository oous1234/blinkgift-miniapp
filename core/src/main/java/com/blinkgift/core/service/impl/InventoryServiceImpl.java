package com.blinkgift.core.service.impl;

import com.blinkgift.core.client.PythonGatewayClient;
import com.blinkgift.core.domain.UserInventoryDocument;
import com.blinkgift.core.domain.UserSyncStateDocument;
import com.blinkgift.core.dto.external.PythonInventoryResponse;
import com.blinkgift.core.dto.resp.InventoryResponse;
import com.blinkgift.core.repository.UserInventoryRepository;
import com.blinkgift.core.repository.UserSyncStateRepository;
import com.blinkgift.core.service.DiscoveryTaskPublisher;
import com.blinkgift.core.service.InventoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class InventoryServiceImpl implements InventoryService {

    private final PythonGatewayClient pythonClient;
    private final UserSyncStateRepository syncStateRepository;
    private final UserInventoryRepository userInventoryRepository;
    private final DiscoveryTaskPublisher discoveryTaskPublisher;
    private final MongoTemplate mongoTemplate;

    @Override
    public InventoryResponse getUserInventory(String userId, int limit, int offset, String sortBy, String modelFilter) {
        UserSyncStateDocument syncState = syncStateRepository.findById(userId)
                .orElseGet(() -> initializeSyncState(userId));

        // Если синхронизация завершена, работаем ТОЛЬКО с нашей БД (полный функционал)
        if (Boolean.TRUE.equals(syncState.getIsFullScanCompleted())) {
            return getInventoryFromDb(userId, limit, offset, sortBy, modelFilter, syncState);
        }

        // Если это первый запрос (PENDING), триггерим фоновую задачу
        if (syncState.getStatus() == UserSyncStateDocument.SyncStatus.PENDING && offset == 0) {
            PythonInventoryResponse live = pythonClient.getInventoryLive(userId, "", 1);
            discoveryTaskPublisher.publishDiscoveryTask(userId, live.getTotal_count());
            syncState.setStatus(UserSyncStateDocument.SyncStatus.IN_PROGRESS);
            syncState.setTotalItemsCount(live.getTotal_count());
            syncStateRepository.save(syncState);
        }

        // Пока данные не готовы полностью, отдаем "Live" из Python (без сложной сортировки)
        PythonInventoryResponse liveBatch = pythonClient.getInventoryLive(userId, String.valueOf(offset), limit);
        return mapToResponse(liveBatch, offset, limit, syncState);
    }

    private InventoryResponse getInventoryFromDb(String userId, int limit, int offset, String sortBy, String modelFilter, UserSyncStateDocument syncState) {
        Query query = new Query(Criteria.where("userId").is(userId));

        if (modelFilter != null && !modelFilter.isBlank()) {
            query.addCriteria(Criteria.where("model").is(modelFilter));
        }

        long total = mongoTemplate.count(query, UserInventoryDocument.class);

        // Сортировка
        Sort sort = Sort.by(Sort.Direction.DESC, "acquiredAt"); // default
        if ("price_desc".equals(sortBy)) sort = Sort.by(Sort.Direction.DESC, "estimatedPrice");
        if ("price_asc".equals(sortBy)) sort = Sort.by(Sort.Direction.ASC, "estimatedPrice");

        query.with(PageRequest.of(offset / limit, limit, sort));
        List<UserInventoryDocument> items = mongoTemplate.find(query, UserInventoryDocument.class);

        // Расчет общей стоимости инвентаря (сумма всех цен юзера)
        BigDecimal totalValue = userInventoryRepository.findAllPricesByUserId(userId).stream()
                .map(UserInventoryDocument::getEstimatedPrice)
                .filter(p -> p != null)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return InventoryResponse.builder()
                .items(items.stream().map(this::mapToDto).collect(Collectors.toList()))
                .total(total)
                .totalInventoryValue(totalValue)
                .limit(limit)
                .offset(offset)
                .sync(mapSyncStatus(syncState))
                .build();
    }

    private InventoryResponse.GiftItemDto mapToDto(UserInventoryDocument doc) {
        return InventoryResponse.GiftItemDto.builder()
                .id(doc.getId())
                .slug(doc.getSlug())
                .name(doc.getName())
                .model(doc.getModel())
                .backdrop(doc.getBackdrop())
                .symbol(doc.getSymbol())
                .price(doc.getEstimatedPrice())
                .image(doc.getImage())
                .serialNumber(doc.getSerialNumber())
                .acquiredAt(doc.getAcquiredAt().toString())
                .build();
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
                .sync(mapSyncStatus(syncState))
                .build();
    }

    private UserSyncStateDocument initializeSyncState(String userId) {
        return syncStateRepository.save(UserSyncStateDocument.builder()
                .userId(userId)
                .status(UserSyncStateDocument.SyncStatus.PENDING)
                .isFullScanCompleted(false)
                .lastSyncAt(Instant.now())
                .build());
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