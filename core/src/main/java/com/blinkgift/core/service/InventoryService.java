package com.blinkgift.core.service;

import com.blinkgift.core.dto.resp.InventoryResponse;

public interface InventoryService {
    /**
     * Получает инвентарь пользователя из внешней системы.
     *
     * @param ownerId ID владельца (UUID)
     * @param tgAuth Строка авторизации Telegram (JSON string)
     * @return Ответ с списком подарков
     */
    InventoryResponse getUserInventory(String ownerId, String tgAuth);
}