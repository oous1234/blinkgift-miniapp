package com.blinkgift.core.service.impl;

import com.blinkgift.core.dto.resp.MarketplaceGiftResponse;
import com.blinkgift.core.repository.MarketplaceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MarketplaceServiceImpl {

    private final MarketplaceRepository marketplaceRepository;

    public List<MarketplaceGiftResponse> getShowcaseGifts() {
        return marketplaceRepository.findLatestGifts(20);
    }
}