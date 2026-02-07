package com.blinkgift.core.service;
import com.blinkgift.core.dto.external.PythonInventoryResponse;
import com.blinkgift.core.dto.resp.InventoryResponse;
import com.blinkgift.core.domain.UserSyncStateDocument;
public interface InventoryService {

    InventoryResponse getUserInventory(String userId, int limit, int offset);


    UserSyncStateDocument getSyncStatus(String userId);
}