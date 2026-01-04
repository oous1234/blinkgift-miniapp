package com.blinkgift.core.service;

import com.blinkgift.core.dto.external.OwnerApiResponse;
import com.blinkgift.core.dto.external.PortfolioHistory;

public interface OwnerService {
    PortfolioHistory getOwnerInfo(String id, String ownerUuid, String tgAuth, String range, String username, String ownerAddress);
}