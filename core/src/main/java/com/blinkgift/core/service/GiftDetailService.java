package com.blinkgift.core.service;

import com.blinkgift.core.dto.resp.FullGiftDetailsResponse;

public interface GiftDetailService {
    FullGiftDetailsResponse getGiftDetailsBySlug(String slug);
}