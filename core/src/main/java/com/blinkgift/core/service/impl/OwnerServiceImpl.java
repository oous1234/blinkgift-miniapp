package com.blinkgift.core.service.impl;

import com.blinkgift.core.client.OwnerApiClient;
import com.blinkgift.core.client.PosoApiClient;
import com.blinkgift.core.dto.external.OwnerHistoryResponse;
import com.blinkgift.core.dto.external.OwnerSearchResponse;
import com.blinkgift.core.dto.external.PosoOwnerProfileResponse;
import com.blinkgift.core.service.OwnerService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class OwnerServiceImpl implements OwnerService {

    private final OwnerApiClient ownerApiClient;
    private final PosoApiClient posoApiClient;

    private static final Pattern UUID_PATTERN = Pattern.compile("^[0-9a-fA-F-]{36}$");

    @Override
    public OwnerHistoryResponse getOwnerInfo(String inputId, String range, String tgAuth) {
        String internalUuid;

        // Логика: UUID берем сразу, Telegram ID резолвим
        if (isUuid(inputId)) {
            internalUuid = inputId;
        } else {
            internalUuid = resolveInternalUuid(inputId, tgAuth);
        }

        return ownerApiClient.getPortfolioHistory(internalUuid, range, tgAuth, null);
    }

    @Override
    public OwnerSearchResponse searchOwners(String query, String order, int limit, int offset, String tgAuth) {
        return posoApiClient.searchOwners(tgAuth, limit, order, query, offset);
    }

    private boolean isUuid(String id) {
        return id != null && UUID_PATTERN.matcher(id).matches();
    }

    private String resolveInternalUuid(String telegramId, String tgAuth) {
        PosoOwnerProfileResponse profile = posoApiClient.getOwnerProfile(telegramId, tgAuth);
        if (profile == null || profile.getId() == null) {
            throw new RuntimeException("User not found");
        }
        return profile.getId();
    }
}