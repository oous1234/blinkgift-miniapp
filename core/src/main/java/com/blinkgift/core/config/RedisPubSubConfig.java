package com.blinkgift.core.config;

import com.blinkgift.core.dto.FilterUpdateEvent;
import com.blinkgift.core.dto.ListingEvent;
import com.blinkgift.core.service.ListingEventDispatcher;
import com.blinkgift.core.service.impl.FilterUpdateListener;
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
                                            MessageListenerAdapter listingListenerAdapter,
                                            MessageListenerAdapter filterListenerAdapter) {
        RedisMessageListenerContainer container = new RedisMessageListenerContainer();
        container.setConnectionFactory(connectionFactory);
        container.addMessageListener(listingListenerAdapter, new ChannelTopic("listing_events"));
        container.addMessageListener(filterListenerAdapter, new ChannelTopic("filter_updates"));
        return container;
    }

    @Bean
    MessageListenerAdapter listingListenerAdapter(ListingEventDispatcher dispatcher) {
        ObjectMapper mapper = new ObjectMapper();
        mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        Jackson2JsonRedisSerializer<ListingEvent> serializer = new Jackson2JsonRedisSerializer<>(mapper, ListingEvent.class);

        MessageListenerAdapter adapter = new MessageListenerAdapter(new Object() {
            public void handleMessage(ListingEvent event) {
                dispatcher.dispatch(event);
            }
        }, "handleMessage");

        adapter.setSerializer(serializer);
        return adapter;
    }

    @Bean
    MessageListenerAdapter filterListenerAdapter(FilterUpdateListener listener) {
        ObjectMapper mapper = new ObjectMapper();
        Jackson2JsonRedisSerializer<FilterUpdateEvent> serializer = new Jackson2JsonRedisSerializer<>(mapper, FilterUpdateEvent.class);

        MessageListenerAdapter adapter = new MessageListenerAdapter(new Object() {
            public void handleMessage(FilterUpdateEvent event) {
                listener.handleFilterUpdate(event);
            }
        }, "handleMessage");

        adapter.setSerializer(serializer);
        return adapter;
    }
}