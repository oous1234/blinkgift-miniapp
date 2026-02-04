package com.blinkgift.core.controller;

import com.blinkgift.core.domain.UserFilterDocument;
import com.blinkgift.core.dto.SniperHistoryDto;
import com.blinkgift.core.service.SniperMatchingEngine; // Добавили импорт
import com.blinkgift.core.service.SniperService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/v1/sniper")
@RequiredArgsConstructor
public class SniperController {
    private final SniperService sniperService;
    private final SniperMatchingEngine matchingEngine; // ТЕПЕРЬ ПОЛЕ ЕСТЬ

    @GetMapping("/history")
    public ResponseEntity<List<SniperHistoryDto>> getSniperHistory(@RequestParam String userId) {
        return ResponseEntity.ok(sniperService.getFilteredHistory(userId));
    }

    @PostMapping("/filters")
    public ResponseEntity<Void> updateFilters(
            @RequestParam String userId,
            @RequestBody UserFilterDocument filters) {

        log.info("📥 POST filters. User: {}, Body: {}", userId, filters);

        filters.setUserId(userId);
        sniperService.updateUserFilters(filters);

        return ResponseEntity.ok().build();
    }

    @GetMapping("/filters")
    public ResponseEntity<UserFilterDocument> getFilters(@RequestParam String userId) {
        return ResponseEntity.ok(sniperService.getUserFilters(userId));
    }

    // --- НОВЫЙ ЭНДПОИНТ ДЛЯ ПРОВЕРКИ ТЕКУЩИХ ФИЛЬТРОВ В ПАМЯТИ ---
    @GetMapping("/debug/active-filters")
    public ResponseEntity<Map<String, UserFilterDocument>> getActiveFilters() {
        return ResponseEntity.ok(matchingEngine.getFilterCache());
    }
}