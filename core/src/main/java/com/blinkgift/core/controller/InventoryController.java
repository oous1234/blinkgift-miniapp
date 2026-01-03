package com.blinkgift.core.controller;

import com.blinkgift.core.dto.resp.InventoryResponse;
import com.blinkgift.core.service.InventoryService;
import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.extern.slf4j.Slf4j;
import tools.jackson.databind.ObjectMapper;

@RestController
@RequestMapping("/inventory")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
@Slf4j
public class InventoryController {

    private final InventoryService inventoryService;
    private final ObjectMapper objectMapper; // 1. Внедряем ObjectMapper

    @GetMapping
    public ResponseEntity<InventoryResponse> getInventory(
            @RequestParam("current_owner_id") String currentOwnerId,
            @RequestParam("tgauth") String tgAuth) {

        if (currentOwnerId == null || currentOwnerId.trim().isEmpty()) {
            log.warn("Inventory request with empty current_owner_id");
            return ResponseEntity.badRequest().build();
        }

        InventoryResponse response = inventoryService.getUserInventory(currentOwnerId, tgAuth);

        // 2. Превращаем объект в JSON-строку и логируем
        // writeValueAsString создает компактный JSON (в одну строку)
        // Если нужно "красиво" с отступами, используйте: writerWithDefaultPrettyPrinter().writeValueAsString(response)
        String jsonResponse = objectMapper.writeValueAsString(response);
        log.info("JSON Response sent to client: {}", jsonResponse);

        return ResponseEntity.ok(response);
    }
}