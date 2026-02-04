package com.blinkgift.core.config;

import com.blinkgift.core.dto.ListingEvent;
import com.blinkgift.core.service.SniperMatchingEngine;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.data.redis.listener.RedisMessageListenerContainer;
import org.springframework.data.redis.listener.adapter.MessageListenerAdapter;
import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer;

@Configuration
public class RedisPubSubConfig {

    @Bean
    RedisMessageListenerContainer container(RedisConnectionFactory connectionFactory,
                                            MessageListenerAdapter listenerAdapter) {
        RedisMessageListenerContainer container = new RedisMessageListenerContainer();
        container.setConnectionFactory(connectionFactory);
        container.addMessageListener(listenerAdapter, new ChannelTopic("listing_events"));
        return container;
    }

    @Bean
    MessageListenerAdapter listenerAdapter(SniperMatchingEngine matchingEngine) {
        ObjectMapper mapper = new ObjectMapper();
        mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

        Jackson2JsonRedisSerializer<ListingEvent> serializer = new Jackson2JsonRedisSerializer<>(mapper, ListingEvent.class);

        MessageListenerAdapter adapter = new MessageListenerAdapter(new Object() {
            public void handleMessage(ListingEvent event) {
                matchingEngine.processNewListing(event);
            }
        }, "handleMessage");
        adapter.setSerializer(serializer);
        return adapter;
    }
}