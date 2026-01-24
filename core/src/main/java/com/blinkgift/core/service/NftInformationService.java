package com.blinkgift.core.service;

import com.blinkgift.core.dto.resp.FullNftGiftResponse;

public interface NftInformationService {
    FullNftGiftResponse getFullNftDetails(String nftAddress);
}