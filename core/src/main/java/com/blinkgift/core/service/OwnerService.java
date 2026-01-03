package com.blinkgift.core.service;

import com.blinkgift.core.dto.external.OwnerApiResponse;

public interface OwnerService {
    OwnerApiResponse getOwnerInfo(String id, String telegramId, String username, String ownerAddress);
}