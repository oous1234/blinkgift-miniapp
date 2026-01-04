package com.blinkgift.core.service;

import com.blinkgift.core.dto.external.GraphicsApiResponse;
import com.blinkgift.core.dto.external.PortfolioHistory;

public interface OwnerService {
    GraphicsApiResponse getOwnerInfo(String ownerUuid, String tgAuth);
}