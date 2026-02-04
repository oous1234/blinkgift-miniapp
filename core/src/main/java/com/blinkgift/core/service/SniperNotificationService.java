package com.blinkgift.core.service;

import com.blinkgift.core.dto.ListingEvent;

public interface SniperNotificationService {
    void sendMatchNotifications(String userId, ListingEvent gift);
}