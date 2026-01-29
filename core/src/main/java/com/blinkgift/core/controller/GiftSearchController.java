package com.blinkgift.core.controller;

import com.blinkgift.core.dto.req.GiftSearchRequest;
import com.blinkgift.core.dto.resp.GiftShortResponse;
import com.blinkgift.core.service.GiftSearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/search")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class GiftSearchController {

    private final GiftSearchService giftSearchService;

    @PostMapping("/gifts")
    public ResponseEntity<List<GiftShortResponse>> searchGifts(@RequestBody GiftSearchRequest request) {
        return ResponseEntity.ok(giftSearchService.search(request));
    }
}