package com.blinkgift.core.controller;

import com.blinkgift.core.dto.req.GiftSearchRequest;
import com.blinkgift.core.dto.resp.GiftShortResponse;
import com.blinkgift.core.service.GiftSearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/gifts")
@RequiredArgsConstructor
public class GiftSearchController {

    private final GiftSearchService giftSearchService;

    @GetMapping("/search")
    public ResponseEntity<List<GiftShortResponse>> searchGifts(GiftSearchRequest request) {
        return ResponseEntity.ok(giftSearchService.searchGifts(request));
    }
}