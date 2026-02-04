package com.blinkgift.core.service.impl;

import com.blinkgift.core.client.BotInternalClient;
import com.blinkgift.core.dto.ListingEvent;
import com.blinkgift.core.dto.SniperNotificationDto;
import com.blinkgift.core.service.SniperNotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class SniperNotificationServiceImpl implements SniperNotificationService {

    private final SimpMessagingTemplate messagingTemplate;
    private final BotInternalClient botInternalClient;

    @Async
    @Override
    public void sendMatchNotifications(String userId, ListingEvent gift) {
        try {
            messagingTemplate.convertAndSendToUser(userId, "/queue/sniper", gift);
        } catch (Exception e) {
            log.error("WS error: {}", e.getMessage());
        }

        try {
            SniperNotificationDto notification = SniperNotificationDto.builder()
                    .userId(Long.parseLong(userId))
                    .giftName(gift.getName())
                    .model(gift.getModel() != null ? gift.getModel() : "Original")
                    .price(gift.getPrice().toString())
                    .marketplace(gift.getMarketplace())
                    .build();

            botInternalClient.notifyBot(notification);
        } catch (Exception e) {
            log.error("Bot notification error: {}", e.getMessage());
        }
    }
}