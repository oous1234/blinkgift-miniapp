package com.blinkgift.core.service;

import com.blinkgift.core.dto.external.GraphicsApiResponse;
import com.blinkgift.core.dto.external.HistoryPoint;
import com.blinkgift.core.dto.external.PortfolioHistory;

import java.util.List;

public interface OwnerService {
    List<HistoryPoint> getOwnerInfo(String ownerUuid, String range, String tgAuth);
}