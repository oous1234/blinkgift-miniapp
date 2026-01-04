package com.blinkgift.core.service.impl;

import com.blinkgift.core.client.OwnerApiClient;
import com.blinkgift.core.dto.external.GraphicsApiResponse;
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

    public GraphicsApiResponse getOwnerInfo(String ownerUuid, String tgAuth) {
        return ownerApiClient.getOwnerGraphics(ownerUuid, tgAuth, null);
    }
}