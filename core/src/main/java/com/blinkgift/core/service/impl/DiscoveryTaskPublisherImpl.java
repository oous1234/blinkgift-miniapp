package com.blinkgift.core.service.impl;

import com.blinkgift.core.service.DiscoveryTaskPublisher;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.connection.stream.StreamRecords;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class DiscoveryTaskPublisherImpl implements DiscoveryTaskPublisher {

    private final RedisTemplate<String, Object> redisTemplate;

    private static final String STREAM_KEY = "discovery_tasks_stream";

    @Override
    public void publishDiscoveryTask(String userId, int totalCount) {
        if (!StringUtils.hasText(userId)) {
            log.warn("Attempted to publish discovery task with null or empty userId");
            return;
        }

        if (totalCount <= 0) {
            log.info("User {} has 0 items in Telegram. Skipping discovery task publication.", userId);
            return;
        }

        try {
            Map<String, String> taskData = Map.of(
                    "userId", userId,
                    "totalCount", String.valueOf(totalCount),
                    "timestamp", String.valueOf(System.currentTimeMillis())
            );

            log.info("Publishing discovery task to Redis Stream: user={}, total={}", userId, totalCount);

            redisTemplate.opsForStream().add(StreamRecords.newRecord()
                    .in(STREAM_KEY)
                    .ofMap(taskData));

            log.debug("Task successfully published to stream {} with key {}", STREAM_KEY, userId);

        } catch (Exception e) {
            log.error("Failed to publish discovery task for user {} to Redis Stream: {}",
                    userId, e.getMessage(), e);
        }
    }
}