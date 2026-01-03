package com.blinkgift.core.service.impl;

import com.blinkgift.core.client.OwnerApiClient;
import com.blinkgift.core.dto.external.OwnerApiResponse;
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
    public OwnerApiResponse getOwnerInfo(String id, String telegramId,String tgAuth, String username, String ownerAddress) {
        log.info("Requesting owner info: id={}, telegramId={}, username={}, ownerAddress={}",
                id, telegramId, username, ownerAddress);

        if (id == null && telegramId == null && username == null && ownerAddress == null) {
            throw new IllegalArgumentException("At least one search parameter must be provided");
        }

        try {
            OwnerApiResponse response = ownerApiClient.getOwnerInfo(id, telegramId,tgAuth, username, ownerAddress, null);

            if (response == null) {
                log.warn("Owner not found for given parameters");
                throw new RuntimeException("Owner not found");
            }

            return response;

        } catch (FeignException e) {
            log.error("Feign Client Error: status={} message={}", e.status(), e.getMessage());
            throw new RuntimeException("External API error: " + e.getMessage(), e);
        } catch (Exception e) {
            log.error("Unexpected error during external API call", e);
            throw new RuntimeException("Service unavailable");
        }
    }
}