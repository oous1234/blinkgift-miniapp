package com.blinkgift.core.service.impl;

import com.blinkgift.core.dto.req.GiftSearchRequest;
import com.blinkgift.core.dto.resp.GiftShortResponse;
import com.blinkgift.core.dto.resp.PagedResponse;
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
    public PagedResponse<GiftShortResponse> search(GiftSearchRequest request) {
        List<GiftShortResponse> items = marketplaceRepository.searchGiftsWithFilters(request);
        long total = marketplaceRepository.countGiftsWithFilters(request);

        return new PagedResponse<>(
                items,
                total,
                request.getLimit(),
                request.getOffset()
        );
    }
}