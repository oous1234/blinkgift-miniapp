package com.blinkgift.core.service.impl;

import com.blinkgift.core.domain.UserFilterDocument;
import com.blinkgift.core.dto.FilterUpdateEvent;
import com.blinkgift.core.repository.UserFilterRepository;
import com.blinkgift.core.service.FilterStreamConsumer;
import com.blinkgift.core.service.SniperMatchingEngine;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.connection.stream.ObjectRecord;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class FilterStreamConsumerImpl implements FilterStreamConsumer {

    private final SniperMatchingEngine matchingEngine;
    private final UserFilterRepository filterRepository;

    @Override
    public void onMessage(ObjectRecord<String, FilterUpdateEvent> message) {
        FilterUpdateEvent event = message.getValue();

        if ("UPDATE".equals(event.getAction())) {
            filterRepository.findById(event.getUserId()).ifPresent(matchingEngine::updateFilter);
        } else if ("DELETE".equals(event.getAction())) {
            matchingEngine.removeFilter(event.getUserId());
        }
    }
}