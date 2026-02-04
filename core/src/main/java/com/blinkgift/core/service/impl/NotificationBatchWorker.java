package com.blinkgift.core.service.impl;

import com.blinkgift.core.client.BotInternalClient;
import com.blinkgift.core.config.NotificationQueueConfig.NotificationTask;
import com.blinkgift.core.dto.SniperNotificationDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.BlockingQueue;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationBatchWorker {

    private final BlockingQueue<NotificationTask> notificationQueue;
    private final BotInternalClient botInternalClient;
    private final SimpMessagingTemplate messagingTemplate;
    private final NotificationPersistenceService persistenceService;

    @Scheduled(fixedDelay = 500)
    public void processQueue() {
        if (notificationQueue.isEmpty()) return;

        List<NotificationTask> tasks = new ArrayList<>();
        notificationQueue.drainTo(tasks);

        log.info("Processing batch of {} notifications", tasks.size());

        List<SniperNotificationDto> botNotifications = new ArrayList<>();

        for (NotificationTask task : tasks) {
            persistenceService.saveMatch(task);

            sendToWebSocket(task);
            botNotifications.add(mapToDto(task));
        }
        if (!botNotifications.isEmpty()) {
            try {
                botInternalClient.notifyBotBatch(botNotifications);
            } catch (Exception e) {
                log.error("Failed to send batch to bot: {}", e.getMessage());
            }
        }
    }

    private void sendToWebSocket(NotificationTask task) {
        messagingTemplate.convertAndSendToUser(task.userId(), "/queue/sniper", task.gift());
    }

    private SniperNotificationDto mapToDto(NotificationTask task) {
        return SniperNotificationDto.builder()
                .userId(Long.parseLong(task.userId()))
                .giftName(task.gift().getName())
                .model(task.gift().getModel())
                .price(task.gift().getPrice().toString())
                .marketplace(task.gift().getMarketplace())
                .build();
    }
}