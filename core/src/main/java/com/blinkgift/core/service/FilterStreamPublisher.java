package com.blinkgift.core.service;

import com.blinkgift.core.domain.UserFilterDocument;

public interface FilterStreamPublisher {
    void publishUpdate(UserFilterDocument filter);
    void publishDelete(String userId);
}