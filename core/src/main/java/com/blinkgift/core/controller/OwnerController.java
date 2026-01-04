package com.blinkgift.core.controller;

import com.blinkgift.core.dto.external.PortfolioHistory;
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
    public ResponseEntity<PortfolioHistory> getOwner(
            @RequestParam(value = "id", required = false) String id,
            @RequestParam(value = "ownerUuid", required = false) String ownerUuid,
            @RequestParam("tgauth") String tgAuth,
            @RequestParam(value = "range", defaultValue = "24h") String range) {

        log.info("Owner Controller request: telegram_id={}, range={}", ownerUuid, range);

        PortfolioHistory response = ownerService.getOwnerInfo(id, ownerUuid, tgAuth, range, null, null);

        // ЛОГИРУЕМ ВЕСЬ ОТВЕТ
        log.info("RESPONSE FROM POSO: {}", response);

        if (response != null && response.getData() != null) {
            log.info("Points count in response: {}", response.getData().size());
        }

        return ResponseEntity.ok(response);
    }
}