package com.blinkgift.core.service.impl;

import com.blinkgift.core.client.PosoApiClient;
import com.blinkgift.core.dto.external.PosoApiResponse;
import com.blinkgift.core.dto.resp.InventoryResponse; // Обратите внимание на ваш пакет
import com.blinkgift.core.service.InventoryService;
import feign.FeignException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
@RequiredArgsConstructor
@Slf4j
public class InventoryServiceImpl implements InventoryService {

    private final PosoApiClient posoApiClient;

    @Override
    public InventoryResponse getUserInventory(String ownerId, String tgAuth) {
        log.info("Requesting external inventory via Feign for ownerId: {}", ownerId);

        try {
            // Вызов выглядит как обычный метод java
            PosoApiResponse response = posoApiClient.getGifts(ownerId, tgAuth);

            if (response != null && response.getGifts() != null) {
                return new InventoryResponse(response.getGifts());
            }

            return new InventoryResponse(Collections.emptyList());

        } catch (FeignException e) {
            // Feign выбрасывает исключения при 4xx и 5xx ошибках
            log.error("Feign Client Error: status={} message={}", e.status(), e.getMessage());

            // Можно пробросить дальше или вернуть пустой список/ошибку
            throw new RuntimeException("External API error", e);
        } catch (Exception e) {
            log.error("Unexpected error during external API call", e);
            throw new RuntimeException("Service unavailable");
        }
    }
}