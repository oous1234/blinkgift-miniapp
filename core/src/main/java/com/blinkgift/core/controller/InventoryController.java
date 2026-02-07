package com.blinkgift.core.controller;

import com.blinkgift.core.dto.resp.InventoryResponse;
import com.blinkgift.core.service.InventoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/v1/inventory")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class InventoryController {

    private final InventoryService inventoryService;

    @GetMapping
    public ResponseEntity<InventoryResponse> getInventory(
            @RequestParam("user_id") String userId,
            @RequestParam(value = "limit", defaultValue = "50") int limit,
            @RequestParam(value = "offset", defaultValue = "0") int offset) {

        log.info("Received inventory request for user: {}", userId);

        if (userId == null || userId.isBlank()) {
            return ResponseEntity.badRequest().build();
        }

        InventoryResponse response = inventoryService.getUserInventory(userId, limit, offset);
        return ResponseEntity.ok(response);
    }
}