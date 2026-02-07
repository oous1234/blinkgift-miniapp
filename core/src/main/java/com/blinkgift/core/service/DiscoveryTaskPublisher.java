package com.blinkgift.core.service;

public interface DiscoveryTaskPublisher {

    void publishDiscoveryTask(String userId, int totalCount);
}