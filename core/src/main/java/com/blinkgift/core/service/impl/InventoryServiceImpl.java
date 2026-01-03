package com.blinkgift.core.service.impl;

import com.blinkgift.core.client.PosoApiClient;
import com.blinkgift.core.dto.external.PosoApiResponse;
import com.blinkgift.core.dto.resp.InventoryResponse;
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
            PosoApiResponse response = posoApiClient.getGifts(ownerId, tgAuth, limit, offset, null);

            if (response != null && response.getGifts() != null) {
                // Передаем gifts, total, limit и offset из ответа API
                return new InventoryResponse(
                        response.getGifts(),
                        response.getTotal(),
                        response.getLimit(),
                        response.getOffset()
                );
            }

            // Если ничего не найдено, возвращаем пустой список и нули (или запрошенные лимиты)
            return new InventoryResponse(Collections.emptyList(), 0, limit, offset);

        } catch (FeignException e) {
            log.error("Feign Client Error: status={} message={}", e.status(), e.getMessage());
            throw new RuntimeException("External API error", e);
        } catch (Exception e) {
            log.error("Unexpected error during external API call", e);
            throw new RuntimeException("Service unavailable");
        }
    }
}