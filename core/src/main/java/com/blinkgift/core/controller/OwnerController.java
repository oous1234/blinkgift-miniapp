package com.blinkgift.core.controller;

import com.blinkgift.core.dto.external.SearchResponseDto;
import com.blinkgift.core.service.OwnerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/owners")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class OwnerController {

    private final OwnerService ownerService;

    @GetMapping("/search")
    public ResponseEntity<SearchResponseDto> search(
            @RequestParam("q") String query,
            @RequestParam(value = "limit", defaultValue = "20") int limit) {
        return ResponseEntity.ok(ownerService.searchOwners(query, limit));
    }
}