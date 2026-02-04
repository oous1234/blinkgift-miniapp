package com.blinkgift.core.client;

import com.blinkgift.core.dto.SniperNotificationDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import java.util.List;

@FeignClient(name = "bot-client", url = "https://blinkbot.ru.tuna.am")
public interface BotInternalClient {

    @PostMapping("/api/internal/v1/sniper-notify")
    void notifyBot(@RequestBody SniperNotificationDto notification);

    @PostMapping("/api/internal/v1/sniper-notify/batch")
    void notifyBotBatch(@RequestBody List<SniperNotificationDto> notifications);
}