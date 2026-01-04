package com.blinkgift.core.service.impl;

import com.blinkgift.core.client.OwnerApiClient;
import com.blinkgift.core.client.PosoApiClient;
import com.blinkgift.core.dto.external.OwnerHistoryResponse;
import com.blinkgift.core.dto.external.PosoOwnerProfileResponse;
import com.blinkgift.core.service.OwnerService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OwnerServiceImpl implements OwnerService {

    private final OwnerApiClient ownerApiClient;
    private final PosoApiClient posoApiClient;

    @Override
    public OwnerHistoryResponse getOwnerInfo(String ownerUuid, String range, String tgAuth) {
        String internalUuid = resolveInternalUuid(ownerUuid, tgAuth);
        return ownerApiClient.getPortfolioHistory(internalUuid, range, tgAuth, null);
    }

    private String resolveInternalUuid(String telegramId, String tgAuth) {
        PosoOwnerProfileResponse profile = posoApiClient.getOwnerProfile(telegramId, tgAuth);
        if (profile == null || profile.getId() == null) {
            throw new RuntimeException("User not found");
        }
        return profile.getId();
    }
}