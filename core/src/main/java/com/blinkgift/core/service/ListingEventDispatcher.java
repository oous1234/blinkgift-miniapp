package com.blinkgift.core.service;

import com.blinkgift.core.dto.ListingEvent;

public interface ListingEventDispatcher {
    void dispatch(ListingEvent event);
}