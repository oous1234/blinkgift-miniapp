package com.blinkgift.core.client;

import com.blinkgift.core.dto.external.OwnerSearchResponse; // Не забудьте импорт
import com.blinkgift.core.dto.external.PosoApiResponse;
import com.blinkgift.core.dto.external.PosoOwnerProfileResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "posoApiClient", url = "https://poso.see.tg")
public interface PosoApiClient {

    @GetMapping("/api/owner/")
    PosoOwnerProfileResponse getOwnerProfile(
            @RequestParam("telegram_id") String telegramId,
            @RequestParam("tgauth") String tgAuth
    );

    @GetMapping("/api/gifts")
    PosoApiResponse getGifts(
            @RequestParam("current_owner_id") String ownerId,
            @RequestParam("tgauth") String tgAuth,
            @RequestParam("limit") int limit,
            @RequestParam("offset") int offset
    );

    @GetMapping("/api/owners")
    OwnerSearchResponse searchOwners(
            @RequestParam("tgauth") String tgAuth,
            @RequestParam("limit") int limit,
            @RequestParam("order") String order,
            @RequestParam("search_query") String searchQuery,
            @RequestParam("offset") int offset
    );
}