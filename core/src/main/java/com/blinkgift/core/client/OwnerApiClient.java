package com.blinkgift.core.client;

import com.blinkgift.core.dto.external.OwnerApiResponse;
import com.blinkgift.core.dto.external.PortfolioHistory;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "owner-client", url = "https://poso.see.tg")
public interface OwnerApiClient {

    @GetMapping("/api/owner/portfolio-history/")
    PortfolioHistory getOwnerHistory(
            @RequestParam(value = "id", required = false) String id,
            @RequestParam(value = "owner_id") String owner_id, // Сюда пойдет UUID
            @RequestParam("tgauth") String tgAuth,
            @RequestParam("range") String range,
            @RequestHeader(value = "User-Agent", defaultValue = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36") String userAgent
    );
}
