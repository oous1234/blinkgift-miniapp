package com.blinkgift.core.config;

import com.blinkgift.core.dto.FilterUpdateEvent;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.stream.Consumer;
import org.springframework.data.redis.connection.stream.ObjectRecord;
import org.springframework.data.redis.connection.stream.ReadOffset;
import org.springframework.data.redis.connection.stream.StreamOffset;
import org.springframework.data.redis.stream.StreamMessageListenerContainer;
import org.springframework.data.redis.stream.StreamMessageListenerContainer.StreamMessageListenerContainerOptions;

import java.time.Duration;
import java.util.UUID;

@Configuration
public class RedisStreamConfig {

    @Bean
    public StreamMessageListenerContainer<String, ObjectRecord<String, FilterUpdateEvent>> filterUpdateContainer(
            RedisConnectionFactory factory,
            org.springframework.data.redis.stream.StreamListener<String, ObjectRecord<String, FilterUpdateEvent>> listener
    ) {
        StreamMessageListenerContainerOptions<String, ObjectRecord<String, FilterUpdateEvent>> options =
                StreamMessageListenerContainerOptions.builder()
                        .batchSize(10)
                        .pollTimeout(Duration.ofSeconds(1))
                        .targetType(FilterUpdateEvent.class)
                        .build();

        StreamMessageListenerContainer<String, ObjectRecord<String, FilterUpdateEvent>> container =
                StreamMessageListenerContainer.create(factory, options);

        container.receive(
                StreamOffset.create("filter_updates_stream", ReadOffset.latest()),
                listener
        );

        return container;
    }
}