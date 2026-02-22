package com.blinkgift.core.service;

import com.blinkgift.core.dto.resp.InventoryResponse;
import com.blinkgift.core.domain.UserSyncStateDocument;

public interface InventoryService {

    InventoryResponse getUserInventory(String userId, int limit, int offset, String sortBy, String model);

    UserSyncStateDocument getSyncStatus(String userId);
}