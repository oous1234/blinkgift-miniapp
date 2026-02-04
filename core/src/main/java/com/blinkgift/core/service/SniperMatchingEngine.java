package com.blinkgift.core.service;

import com.blinkgift.core.domain.UserFilterDocument;
import com.blinkgift.core.dto.ListingEvent;
import java.util.Map;

public interface SniperMatchingEngine {
    void processListing(ListingEvent gift);
    void updateFilter(UserFilterDocument filter);
    void removeFilter(String userId);
    void warmUp();
    Map<String, UserFilterDocument> getFilterCache();
}