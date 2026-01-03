package com.blinkgift.core.controller;

import com.blinkgift.core.dto.resp.InventoryResponse;
import com.blinkgift.core.service.InventoryService;
import com.fasterxml.jackson.core.JsonProcessingException;
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
            @RequestParam("tgauth") String tgAuth,
            @RequestParam(value = "limit", defaultValue = "50") int limit,
            @RequestParam(value = "offset", defaultValue = "0") int offset) throws JsonProcessingException {

        if (currentOwnerId == null || currentOwnerId.trim().isEmpty()) {
            log.warn("Inventory request with empty current_owner_id");
            return ResponseEntity.badRequest().build();
        }
        log.info(currentOwnerId);
        log.info(tgAuth);
        log.info(String.valueOf(limit));
        log.info(String.valueOf(offset));


        if (limit > 50) {
            limit = 50;
        }

        InventoryResponse response = inventoryService.getUserInventory(currentOwnerId, tgAuth, 10, offset);
        return ResponseEntity.ok(response);
    }
}