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
public class OwnerServiceImpl implements OwnerService {

    private final OwnerApiClient ownerApiClient;
    private final PosoApiClient posoApiClient;

    @Override
    public PortfolioHistory getOwnerInfo(String ownerUuid, String range, String tgAuth) {
        String internalUuid = resolveInternalUuid(ownerUuid, tgAuth);
        // Вызываем новый метод клиента
        return ownerApiClient.getPortfolioHistory(internalUuid, range, tgAuth, null);
    }

    private String resolveInternalUuid(String telegramId, String tgAuth) {
        // ... (логика resolveInternalUuid остается прежней)
        PosoOwnerProfileResponse profile = posoApiClient.getOwnerProfile(telegramId, tgAuth);
        return profile.getId();
    }
}