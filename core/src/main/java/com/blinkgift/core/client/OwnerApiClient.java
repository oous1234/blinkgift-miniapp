package com.blinkgift.core.client;

import com.blinkgift.core.dto.external.OwnerApiResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "owner-client", url = "https://poso.see.tg")
public interface OwnerApiClient {

    @GetMapping("/api/owner/portfolio-history")
    OwnerApiResponse getOwnerInfo(
            @RequestParam(value = "id", required = false) String id,
            @RequestParam(value = "owner_id", required = false) String telegramId,
            @RequestParam("tgauth") String tgAuth,
            @RequestParam("range") String range,
            @RequestParam(value = "username", required = false) String username,
            @RequestParam(value = "owner_address", required = false) String ownerAddress,
            @RequestHeader(value = "User-Agent", defaultValue = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36") String userAgent
    );
}
