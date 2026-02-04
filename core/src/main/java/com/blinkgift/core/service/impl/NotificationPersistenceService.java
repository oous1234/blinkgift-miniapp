package com.blinkgift.core.service.impl;

import com.blinkgift.core.domain.SniperMatchDocument;
import com.blinkgift.core.repository.SniperMatchRepository;
import com.blinkgift.core.config.NotificationQueueConfig.NotificationTask;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Date;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationPersistenceService {

    private final SniperMatchRepository matchRepository;

    public void saveMatch(NotificationTask task) {
        try {
            SniperMatchDocument match = SniperMatchDocument.builder()
                    .userId(task.userId())
                    .giftName(task.gift().getName())
                    .model(task.gift().getModel())
                    .backdrop(task.gift().getBackdrop())
                    .symbol(task.gift().getSymbol())
                    .price(task.gift().getPrice())
                    .marketplace(task.gift().getMarketplace())
                    .address(task.gift().getAddress())
                    .createdAt(new Date())
                    .build();

            matchRepository.save(match);
        } catch (Exception e) {
            log.error("Failed to persist sniper match for user {}", task.userId(), e);
        }
    }
}