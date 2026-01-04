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
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
@Slf4j
public class OwnerController {

    private final OwnerService ownerService;

    @GetMapping
    public ResponseEntity<GraphicsApiResponse> getOwner(
            @RequestParam("ownerUuid") String ownerUuid,
            @RequestParam("tgauth") String tgAuth) {

        log.info("Fetching full portfolio history for ownerUuid: {}", ownerUuid);
        return ResponseEntity.ok(ownerService.getOwnerInfo(ownerUuid, tgAuth));
    }
}