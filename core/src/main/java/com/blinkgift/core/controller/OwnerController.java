package com.blinkgift.core.controller;

import com.blinkgift.core.dto.external.GraphicsApiResponse;
import com.blinkgift.core.dto.external.PortfolioHistory;
import com.blinkgift.core.service.OwnerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/owner")
@RequiredArgsConstructor
public class OwnerController {

    private final OwnerService ownerService;

    @GetMapping
    public ResponseEntity<PortfolioHistory> getOwner(
            @RequestParam("ownerUuid") String ownerUuid,
            @RequestParam(value = "range", defaultValue = "30d") String range,
            @RequestParam("tgauth") String tgAuth) {

        return ResponseEntity.ok(ownerService.getOwnerInfo(ownerUuid, range, tgAuth));
    }
}