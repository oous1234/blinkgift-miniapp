package com.blinkgift.core.service.impl;

import com.blinkgift.core.config.NotificationQueueConfig.NotificationTask;
import com.blinkgift.core.dto.ListingEvent;
import com.blinkgift.core.service.SniperNotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.concurrent.BlockingQueue;

@Slf4j
@Service
@RequiredArgsConstructor
public class SniperNotificationServiceImpl implements SniperNotificationService {

    private final BlockingQueue<NotificationTask> notificationQueue;

    @Override
    public void sendMatchNotifications(String userId, ListingEvent gift) {
        boolean offered = notificationQueue.offer(new NotificationTask(userId, gift));
        if (!offered) {
            log.warn("Notification queue is full. Dropping notification for user {}", userId);
        }
    }
}