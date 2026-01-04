package com.blinkgift.core.service.impl;

import com.blinkgift.core.client.OwnerApiClient;
import com.blinkgift.core.dto.external.OwnerApiResponse;
import com.blinkgift.core.dto.external.PortfolioHistory;
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

    @Override
    public PortfolioHistory getOwnerInfo(String id, String ownerUuid, String tgAuth, String range, String username, String ownerAddress) {
        // Тот самый UUID, который тебе нужен

        log.info("Requesting history for owner_id: {} with range: {}", ownerUuid, range);

        try {
            return ownerApiClient.getOwnerHistory(null, ownerUuid, tgAuth, range, null);
        } catch (Exception e) {
            log.error("Error calling history API: {}", e.getMessage());
            throw new RuntimeException("API Error");
        }
    }
}