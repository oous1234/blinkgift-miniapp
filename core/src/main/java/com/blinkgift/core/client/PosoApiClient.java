package com.blinkgift.core.client;

import com.blinkgift.core.dto.external.PosoApiResponse;
import com.blinkgift.core.dto.external.PosoOwnerProfileResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "posoApiClient", url = "https://poso.see.tg")
public interface PosoApiClient {

    // Получение UUID по Telegram ID (работает)
    @GetMapping("/api/owner/")
    PosoOwnerProfileResponse getOwnerProfile(
            @RequestParam("telegram_id") String telegramId,
            @RequestParam("tgauth") String tgAuth
    );

    // ИСПРАВЛЕНО: Путь теперь включает ownerId в саму строку пути.
    // Это наиболее вероятный рабочий эндпоинт для этого API: /api/owner/{uuid}/inventory
    @GetMapping("/api/gifts")
    PosoApiResponse getGifts(
            @RequestParam("current_owner_id") String ownerId,
            @RequestParam("tgauth") String tgAuth,
            @RequestParam("limit") int limit,
            @RequestParam("offset") int offset
    );
}