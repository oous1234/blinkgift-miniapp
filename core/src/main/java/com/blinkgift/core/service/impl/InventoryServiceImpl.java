package com.blinkgift.core.service.impl;

import com.blinkgift.core.client.PosoApiClient;
import com.blinkgift.core.dto.external.PosoApiResponse;
import com.blinkgift.core.dto.external.PosoOwnerProfileResponse;
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
    public InventoryResponse getUserInventory(String telegramId, String tgAuth, int limit, int offset) {
        log.info("Starting inventory flow for telegramId={}", telegramId);

        try {
            String internalUuid = resolveInternalUuid(telegramId, tgAuth);
            log.info("Resolved UUID: {}", internalUuid);

            // Теперь вызываем без лишнего пятого параметра
            PosoApiResponse response = posoApiClient.getGifts(internalUuid, tgAuth, limit, offset);

            if (response != null && response.getGifts() != null) {
                return new InventoryResponse(
                        response.getGifts(),
                        response.getTotal(),
                        response.getLimit(),
                        response.getOffset()
                );
            }
            return new InventoryResponse(Collections.emptyList(), 0, limit, offset);
        } catch (FeignException e) {
            // Логируем детально, что именно ответил сервер
            log.error("Feign Error! Status: {}, Body: {}", e.status(), e.contentUTF8());
            throw new RuntimeException("Error communicating with external provider", e);
        }
    }

    /**
     * Вспомогательный метод для конвертации Telegram ID в UUID профиля
     */
    private String resolveInternalUuid(String telegramId, String tgAuth) {
        try {
            PosoOwnerProfileResponse profile = posoApiClient.getOwnerProfile(telegramId, tgAuth);
            if (profile == null || profile.getId() == null) {
                throw new RuntimeException("User profile not found for telegramId: " + telegramId);
            }
            return profile.getId();
        } catch (FeignException.NotFound e) {
            log.error("User not found in Poso system: {}", telegramId);
            throw new RuntimeException("User not registered in the external system");
        }
    }
}