package com.blinkgift.core.controller;

import com.blinkgift.core.domain.UserFilterDocument;
import com.blinkgift.core.dto.SniperHistoryDto;
import com.blinkgift.core.service.SniperMatchingEngine;
import com.blinkgift.core.service.SniperService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/sniper")
@RequiredArgsConstructor
public class SniperController {
    private final SniperService sniperService;
    private final SniperMatchingEngine matchingEngine;

    @GetMapping("/history")
    public ResponseEntity<List<SniperHistoryDto>> getSniperHistory(
            @RequestParam String userId,
            @RequestParam(defaultValue = "50") int limit) {
        return ResponseEntity.ok(sniperService.getMatchHistory(userId, limit));
    }

    @PostMapping("/filters")
    public ResponseEntity<Void> updateFilters(
            @RequestParam String userId,
            @RequestBody UserFilterDocument filters) {
        filters.setUserId(userId);
        sniperService.updateUserFilters(filters);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/filters")
    public ResponseEntity<UserFilterDocument> getFilters(@RequestParam String userId) {
        return ResponseEntity.ok(sniperService.getUserFilters(userId));
    }

    @GetMapping("/debug/active-filters")
    public ResponseEntity<Map<String, UserFilterDocument>> getActiveFilters() {
        return ResponseEntity.ok(matchingEngine.getFilterCache());
    }
}