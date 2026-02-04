package com.blinkgift.core.service.impl;

import com.blinkgift.core.domain.UserFilterDocument;
import com.blinkgift.core.dto.FilterUpdateEvent;
import com.blinkgift.core.service.FilterStreamPublisher;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.connection.stream.ObjectRecord;
import org.springframework.data.redis.connection.stream.StreamRecords;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FilterStreamPublisherImpl implements FilterStreamPublisher {

    private final RedisTemplate<String, Object> redisTemplate;
    private static final String STREAM_KEY = "filter_updates_stream";

    @Override
    public void publishUpdate(UserFilterDocument filter) {
        FilterUpdateEvent event = new FilterUpdateEvent(filter.getUserId(), "UPDATE", filter.getVersion());
        sendEvent(event);
    }

    @Override
    public void publishDelete(String userId) {
        FilterUpdateEvent event = new FilterUpdateEvent(userId, "DELETE", System.currentTimeMillis());
        sendEvent(event);
    }

    private void sendEvent(FilterUpdateEvent event) {
        ObjectRecord<String, FilterUpdateEvent> record = StreamRecords.newRecord()
                .in(STREAM_KEY)
                .ofObject(event);
        redisTemplate.opsForStream().add(record);
    }
}