package com.blinkgift.core.service;

import com.blinkgift.core.dto.resp.GiftDetailsResponse;

public interface GiftDetailService {
    GiftDetailsResponse getGiftDetailsBySlug(String slug);
}