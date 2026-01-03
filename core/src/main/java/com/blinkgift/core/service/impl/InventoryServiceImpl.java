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
    public InventoryResponse getUserInventory(String ownerId, String tgAuth, int limit, int offset) {
        log.info("Requesting external inventory: ownerId={}, limit={}, offset={}", ownerId, limit, offset);

        try {
            // Передаем лимит и смещение в Feign клиент
            PosoApiResponse response = posoApiClient.getGifts(ownerId, tgAuth, limit, offset);

            if (response != null && response.getGifts() != null) {
                return new InventoryResponse(response.getGifts());
            }

            return new InventoryResponse(Collections.emptyList());

        } catch (FeignException e) {
            log.error("Feign Client Error: status={} message={}", e.status(), e.getMessage());
            throw new RuntimeException("External API error", e);
        } catch (Exception e) {
            log.error("Unexpected error during external API call", e);
            throw new RuntimeException("Service unavailable");
        }
    }
}