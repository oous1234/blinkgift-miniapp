package com.blinkgift.core.service.impl;

import com.blinkgift.core.service.DiscoveryService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class DiscoveryServiceStub implements DiscoveryService {
    @Override
    public void triggerInventorySync(String userId, String startOffset) {
        log.info("!!! STUB !!! Triggering background sync for user: {} from offset: {}", userId, startOffset);
    }

    @Override
    public void enqueueMetadataEnrichment(String slug) {
        log.info("!!! STUB !!! Enqueue enrichment for slug: {}", slug);
    }
}