package com.blinkgift.core.controller;

import com.blinkgift.core.dto.resp.FullNftGiftResponse;
import com.blinkgift.core.service.NftInformationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/nft-explorer/")
@RequiredArgsConstructor
public class NftExplorerController {

    private final NftInformationService nftInformationService;

    @GetMapping("/details/{address}")
    public ResponseEntity<FullNftGiftResponse> getNftFullDetails(@PathVariable String address) {
        return ResponseEntity.ok(nftInformationService.getFullNftDetails(address));
    }
}