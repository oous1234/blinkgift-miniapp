package com.blinkgift.core.service.impl;

import com.blinkgift.core.domain.UserFilterDocument;
import com.blinkgift.core.dto.ListingEvent;
import com.blinkgift.core.repository.UserFilterRepository;
import com.blinkgift.core.service.SniperMatchingEngine;
import com.blinkgift.core.service.SniperNotificationService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Service
@RequiredArgsConstructor
public class SniperMatchingEngineImpl implements SniperMatchingEngine {

    private final UserFilterRepository filterRepository;
    private final SniperNotificationService notificationService;

    private final Map<String, Set<String>> modelIndex = new ConcurrentHashMap<>();
    private final Map<String, Set<String>> backdropIndex = new ConcurrentHashMap<>();
    private final Map<String, Set<String>> symbolIndex = new ConcurrentHashMap<>();
    private final Map<String, UserFilterDocument> filterCache = new ConcurrentHashMap<>();

    @PostConstruct
    @Override
    public void warmUp() {
        List<UserFilterDocument> allFilters = filterRepository.findAll();
        allFilters.forEach(this::updateFilter);
    }

    @Override
    public void processListing(ListingEvent gift) {
        Set<String> candidates = new HashSet<>();

        if (gift.getModel() != null) {
            Set<String> users = modelIndex.get(gift.getModel());
            if (users != null) candidates.addAll(users);
        }
        if (gift.getBackdrop() != null) {
            Set<String> users = backdropIndex.get(gift.getBackdrop());
            if (users != null) candidates.addAll(users);
        }
        if (gift.getSymbol() != null) {
            Set<String> users = symbolIndex.get(gift.getSymbol());
            if (users != null) candidates.addAll(users);
        }

        if (candidates.isEmpty()) return;

        for (String userId : candidates) {
            UserFilterDocument filter = filterCache.get(userId);
            if (filter != null && isMatch(gift, filter)) {
                notificationService.sendMatchNotifications(userId, gift);
            }
        }
    }

    private boolean isMatch(ListingEvent gift, UserFilterDocument filter) {
        if (filter.getModels() != null && !filter.getModels().isEmpty()) {
            if (!filter.getModels().contains(gift.getModel())) return false;
        }
        if (filter.getBackdrops() != null && !filter.getBackdrops().isEmpty()) {
            if (!filter.getBackdrops().contains(gift.getBackdrop())) return false;
        }
        if (filter.getSymbols() != null && !filter.getSymbols().isEmpty()) {
            if (!filter.getSymbols().contains(gift.getSymbol())) return false;
        }
        return true;
    }

    @Override
    public void updateFilter(UserFilterDocument filter) {
        String userId = filter.getUserId();
        removeFilter(userId);
        filterCache.put(userId, filter);

        if (filter.getModels() != null) {
            filter.getModels().forEach(m -> modelIndex.computeIfAbsent(m, k -> ConcurrentHashMap.newKeySet()).add(userId));
        }
        if (filter.getBackdrops() != null) {
            filter.getBackdrops().forEach(b -> backdropIndex.computeIfAbsent(b, k -> ConcurrentHashMap.newKeySet()).add(userId));
        }
        if (filter.getSymbols() != null) {
            filter.getSymbols().forEach(s -> symbolIndex.computeIfAbsent(s, k -> ConcurrentHashMap.newKeySet()).add(userId));
        }
    }

    @Override
    public void removeFilter(String userId) {
        UserFilterDocument old = filterCache.remove(userId);
        if (old != null) {
            removeFromIndex(modelIndex, old.getModels(), userId);
            removeFromIndex(backdropIndex, old.getBackdrops(), userId);
            removeFromIndex(symbolIndex, old.getSymbols(), userId);
        }
    }

    private void removeFromIndex(Map<String, Set<String>> index, List<String> values, String userId) {
        if (values != null) {
            values.forEach(v -> {
                Set<String> set = index.get(v);
                if (set != null) set.remove(userId);
            });
        }
    }

    @Override
    public Map<String, UserFilterDocument> getFilterCache() {
        return Collections.unmodifiableMap(filterCache);
    }
}