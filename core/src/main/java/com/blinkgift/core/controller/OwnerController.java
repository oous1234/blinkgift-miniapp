package com.blinkgift.core.controller;

import com.blinkgift.core.dto.external.OwnerHistoryResponse;
import com.blinkgift.core.dto.external.OwnerSearchResponse; // Импорт
import com.blinkgift.core.service.OwnerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/owner")
@RequiredArgsConstructor
public class OwnerController {

    private final OwnerService ownerService;

    @GetMapping
    public ResponseEntity<OwnerHistoryResponse> getOwner(
            @RequestParam("ownerUuid") String ownerUuid,
            @RequestParam(value = "range", defaultValue = "30d") String range,
            @RequestParam("tgauth") String tgAuth) {
        return ResponseEntity.ok(ownerService.getOwnerInfo(ownerUuid, range, tgAuth));
    }

    @GetMapping("/search")
    public ResponseEntity<OwnerSearchResponse> searchOwners(
            @RequestParam(value = "search_query", required = false) String searchQuery,
            @RequestParam(value = "order", defaultValue = "desc") String order,
            @RequestParam(value = "limit", defaultValue = "10") int limit,
            @RequestParam(value = "offset", defaultValue = "0") int offset,
            @RequestParam("tgauth") String tgAuth
    ) {
        OwnerSearchResponse response = ownerService.searchOwners(searchQuery, order, limit, offset, tgAuth);
        return ResponseEntity.ok(response);
    }
}