package com.blinkgift.core.service;

import com.blinkgift.core.dto.FilterUpdateEvent;
import org.springframework.data.redis.connection.stream.ObjectRecord;
import org.springframework.data.redis.stream.StreamListener;

public interface FilterStreamConsumer extends StreamListener<String, ObjectRecord<String, FilterUpdateEvent>> {
}