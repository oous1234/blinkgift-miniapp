package com.blinkgift.core.service.impl;

import com.blinkgift.core.domain.UserFilterDocument;
import com.blinkgift.core.dto.FilterUpdateEvent;
import com.blinkgift.core.repository.UserFilterRepository;
import com.blinkgift.core.service.SniperMatchingEngine;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class FilterUpdateListener {

    private final SniperMatchingEngine matchingEngine;
    private final UserFilterRepository filterRepository;

    public void handleFilterUpdate(FilterUpdateEvent event) {
        if ("UPDATE".equals(event.getAction())) {
            filterRepository.findById(event.getUserId()).ifPresent(matchingEngine::updateFilter);
        } else if ("DELETE".equals(event.getAction())) {
            matchingEngine.removeFilter(event.getUserId());
        }
    }
}