package com.blinkgift.core.service;

import com.blinkgift.core.dto.req.GiftSearchRequest;
import com.blinkgift.core.dto.resp.GiftShortResponse;
import com.blinkgift.core.dto.resp.PagedResponse;

public interface GiftSearchService {
    PagedResponse<GiftShortResponse> search(GiftSearchRequest request);
}