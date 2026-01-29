package com.blinkgift.core.service;

import com.blinkgift.core.dto.req.GiftSearchRequest;
import com.blinkgift.core.dto.resp.GiftShortResponse;
import java.util.List;

public interface GiftSearchService {
    List<GiftShortResponse> search(GiftSearchRequest request);
}