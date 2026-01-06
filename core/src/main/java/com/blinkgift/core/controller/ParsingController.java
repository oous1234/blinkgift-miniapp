package com.blinkgift.core.controller;

import com.blinkgift.core.service.GetGemsParsingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/parsing")
@RequiredArgsConstructor
public class ParsingController {

    private final GetGemsParsingService parsingService;

        @PostMapping("/history/{collectionAddress}")
    public ResponseEntity<String> startParsing(@PathVariable String collectionAddress) {
        // Запускаем асинхронный процесс
        parsingService.parseFullHistory(collectionAddress);

        return ResponseEntity.ok("Parsing started for collection: " + collectionAddress);
    }
}