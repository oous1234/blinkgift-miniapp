package com.blinkgift.core.controller;

import com.blinkgift.core.dto.resp.GiftDetailsResponse;
import com.blinkgift.core.service.GiftDetailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/gifts")
@RequiredArgsConstructor
public class GiftDetailController {

    private final GiftDetailService giftDetailService;

    @GetMapping("/{slug}")
    public ResponseEntity<GiftDetailsResponse> getGiftDetails(@PathVariable String slug) {
        return ResponseEntity.ok(giftDetailService.getGiftDetailsBySlug(slug));
    }
}