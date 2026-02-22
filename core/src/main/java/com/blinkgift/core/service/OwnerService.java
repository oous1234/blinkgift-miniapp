package com.blinkgift.core.service;

import com.blinkgift.core.dto.external.SearchResponseDto;

public interface OwnerService {
    SearchResponseDto searchOwners(String query, int limit);
}