package com.blinkgift.core.controller;

import com.blinkgift.core.dto.resp.MarketplaceGiftResponse;
import com.blinkgift.core.service.impl.MarketplaceServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/marketplace")
@RequiredArgsConstructor
public class MarketplaceController {

    private final MarketplaceServiceImpl marketplaceService;

    @GetMapping("/showcase")
    public ResponseEntity<List<MarketplaceGiftResponse>> getShowcase() {
        return ResponseEntity.ok(marketplaceService.getShowcaseGifts());
    }
}