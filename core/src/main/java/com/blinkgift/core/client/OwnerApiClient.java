package com.blinkgift.core.client;

import com.blinkgift.core.dto.external.GraphicsApiResponse;
import com.blinkgift.core.dto.external.OwnerApiResponse;
import com.blinkgift.core.dto.external.PortfolioHistory;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "owner-client", url = "https://poso.see.tg")
public interface OwnerApiClient {

    @GetMapping("/api/owner/portfolio-history")
    PortfolioHistory getPortfolioHistory(
            @RequestParam("owner_id") String ownerId,
            @RequestParam("range") String range,
            @RequestParam("tgauth") String tgAuth,
            @RequestHeader(value = "User-Agent", defaultValue = "Mozilla/5.0...") String userAgent
    );
}