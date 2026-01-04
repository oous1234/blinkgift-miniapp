package com.blinkgift.core.service.impl;

import com.blinkgift.core.client.OwnerApiClient;
import com.blinkgift.core.client.PosoApiClient;
import com.blinkgift.core.dto.external.GraphicsApiResponse;
import com.blinkgift.core.dto.external.OwnerApiResponse;
import com.blinkgift.core.dto.external.PortfolioHistory;
import com.blinkgift.core.dto.external.PosoOwnerProfileResponse;
import com.blinkgift.core.service.OwnerService;
import feign.FeignException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class OwnerServiceImpl implements OwnerService {

    private final OwnerApiClient ownerApiClient;
    private final PosoApiClient posoApiClient;

    public GraphicsApiResponse getOwnerInfo(String ownerUuid, String tgAuth) {
        String internalUuid = resolveInternalUuid(ownerUuid, tgAuth);
        System.out.println("test" + internalUuid);
        return ownerApiClient.getOwnerGraphics(internalUuid, tgAuth, null);
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