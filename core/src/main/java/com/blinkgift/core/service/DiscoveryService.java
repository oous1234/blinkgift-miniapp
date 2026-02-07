package com.blinkgift.core.service;
public interface DiscoveryService {

    void triggerInventorySync(String userId, String startOffset);

    void enqueueMetadataEnrichment(String slug);
}