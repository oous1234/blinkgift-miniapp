package com.blinkgift.core.client;

import com.blinkgift.core.dto.SniperNotificationDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "bot-client", url = "https://blinkbot.ru.tuna.am")
public interface BotInternalClient {
    @PostMapping("/api/internal/v1/sniper-notify")
    void notifyBot(@RequestBody SniperNotificationDto notification);
}