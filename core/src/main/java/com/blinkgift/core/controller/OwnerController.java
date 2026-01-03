package com.blinkgift.core.controller;

import com.blinkgift.core.dto.external.OwnerApiResponse;
import com.blinkgift.core.service.OwnerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/owner")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
@Slf4j
public class OwnerController {

    private final OwnerService ownerService;

    @GetMapping
    public ResponseEntity<OwnerApiResponse> getOwner(
            @RequestParam(value = "id", required = false) String id,
            @RequestParam(value = "telegram_id", required = false) String telegramId,
            @RequestParam(value = "username", required = false) String username,
            @RequestParam(value = "owner_address", required = false) String ownerAddress) {

        log.info("Owner request: id={}, telegramId={}, username={}, ownerAddress={}",
                id, telegramId, username, ownerAddress);

        try {
            OwnerApiResponse response = ownerService.getOwnerInfo(id, telegramId, username, ownerAddress);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            log.warn("Invalid request parameters: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (RuntimeException e) {
            log.error("Error fetching owner info", e);
            return ResponseEntity.status(500).build();
        }
    }
}