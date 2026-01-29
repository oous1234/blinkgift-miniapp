package com.blinkgift.core.service.impl;

import com.blinkgift.core.dto.req.GiftSearchRequest;
import com.blinkgift.core.dto.resp.GiftShortResponse;
import com.blinkgift.core.repository.MarketplaceRepository;
import com.blinkgift.core.service.GiftSearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GiftSearchServiceImpl implements GiftSearchService {

    private final MarketplaceRepository marketplaceRepository;

    @Override
    public List<GiftShortResponse> search(GiftSearchRequest request) {
        return marketplaceRepository.searchGiftsWithFilters(request);
    }
}