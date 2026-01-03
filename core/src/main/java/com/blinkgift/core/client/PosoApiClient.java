package com.blinkgift.core.client;

import com.blinkgift.core.dto.external.PosoApiResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "poso-client", url = "https://poso.see.tg")
public interface PosoApiClient {

    @GetMapping("/api/gifts")
    PosoApiResponse getGifts(
            @RequestParam("current_owner_id") String currentOwnerId,
            @RequestParam("tgauth") String tgAuth,
            @RequestParam("limit") int limit,
            @RequestParam("offset") int offset
    );
}