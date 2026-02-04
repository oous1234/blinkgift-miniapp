package com.blinkgift.core.service.impl;

import com.blinkgift.core.dto.ListingEvent;
import com.blinkgift.core.service.ListingEventDispatcher;
import com.blinkgift.core.service.SniperMatchingEngine;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ListingEventDispatcherImpl implements ListingEventDispatcher {

    private final SniperMatchingEngine matchingEngine;

    @Override
    @Async("sniperExchangeExecutor")
    public void dispatch(ListingEvent event) {
        matchingEngine.processListing(event);
    }
}