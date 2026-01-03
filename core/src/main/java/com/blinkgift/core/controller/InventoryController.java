package com.blinkgift.core.controller;

import com.blinkgift.core.dto.resp.InventoryResponse;
import com.blinkgift.core.service.InventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/inventory")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
@Slf4j
public class InventoryController {

    private final InventoryService inventoryService;

    @GetMapping
    public ResponseEntity<InventoryResponse> getInventory(
            @RequestParam("current_owner_id") String currentOwnerId,
            @RequestParam("tgauth") String tgAuth) {

        if (currentOwnerId == null || currentOwnerId.trim().isEmpty()) {
            log.warn("Inventory request with empty current_owner_id"); // Полезно логировать и ошибки
            return ResponseEntity.badRequest().build();
        }

        InventoryResponse response = inventoryService.getUserInventory(currentOwnerId, tgAuth);

        // 3. Вывод ответа в консоль
        // Используем плейсхолдер {}, чтобы Java не склеивала строки лишний раз
        log.info("Inventory response for {}: {}", currentOwnerId, response);

        return ResponseEntity.ok(response);
    }
}
