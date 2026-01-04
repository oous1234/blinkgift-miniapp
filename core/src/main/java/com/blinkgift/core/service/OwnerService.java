package com.blinkgift.core.service;

import com.blinkgift.core.dto.external.*;

import java.util.List;

public interface OwnerService {

    OwnerHistoryResponse getOwnerInfo(String ownerUuid, String range, String tgAuth);

    OwnerSearchResponse searchOwners(String query, String order, int limit, int offset, String tgAuth);
}