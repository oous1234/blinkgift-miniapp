package com.blinkgift.core.config;

import com.blinkgift.core.dto.ListingEvent;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import java.util.concurrent.BlockingQueue;
import java.util.concurrent.Executor;
import java.util.concurrent.LinkedBlockingQueue;

@Configuration
public class NotificationQueueConfig {

    @Bean
    public BlockingQueue<NotificationTask> notificationQueue() {
        return new LinkedBlockingQueue<>(10000);
    }

    @Bean(name = "notificationExecutor")
    public Executor notificationExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(2);
        executor.setMaxPoolSize(5);
        executor.setQueueCapacity(500);
        executor.setThreadNamePrefix("notif-worker-");
        executor.initialize();
        return executor;
    }

    public record NotificationTask(String userId, ListingEvent gift) {}
}