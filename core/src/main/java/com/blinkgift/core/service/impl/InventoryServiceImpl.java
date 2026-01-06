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
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
@Slf4j
public class InventoryServiceImpl implements InventoryService {

    private final PosoApiClient posoApiClient;
    // Простой паттерн для проверки UUID
    private static final Pattern UUID_PATTERN = Pattern.compile("^[0-9a-fA-F-]{36}$");

    @Override
    public InventoryResponse getUserInventory(String inputId, String tgAuth, int limit, int offset) {
        log.info("Starting inventory flow for id={}", inputId);

        try {
            String internalUuid;

            // Проверяем: если это UUID, используем его сразу. Если нет (цифры) - резолвим.
            if (isUuid(inputId)) {
                internalUuid = inputId;
                log.info("Input is UUID, using directly: {}", internalUuid);
            } else {
                internalUuid = resolveInternalUuid(inputId, tgAuth);
                log.info("Input is Telegram ID, resolved to UUID: {}", internalUuid);
            }

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
            log.error("Feign Error! Status: {}, Body: {}", e.status(), e.contentUTF8());
            throw new RuntimeException("Error communicating with external provider", e);
        }
    }

    private boolean isUuid(String id) {
        return id != null && UUID_PATTERN.matcher(id).matches();
    }

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