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
        log.info("Starting Sniper Engine warm-up...");
        List<UserFilterDocument> allFilters = filterRepository.findAll();
        allFilters.forEach(this::updateFilter);
        log.info("Warm-up completed. Loaded {} filters.", filterCache.size());
    }

    @Override
    public void processListing(ListingEvent gift) {
        log.debug("Processing sniper match for: {}", gift.getName());

        List<Set<String>> candidateSets = new ArrayList<>();
        collectCandidates(candidateSets, modelIndex, gift.getModel());
        collectCandidates(candidateSets, backdropIndex, gift.getBackdrop());
        collectCandidates(candidateSets, symbolIndex, gift.getSymbol());

        if (candidateSets.isEmpty()) {
            log.debug("No candidates found for attributes of {}", gift.getName());
            return;
        }

        Set<String> uniqueCandidates = new HashSet<>();
        candidateSets.sort(Comparator.comparingInt(Set::size));

        for (Set<String> set : candidateSets) {
            for (String userId : set) {
                if (uniqueCandidates.add(userId)) {
                    checkAndNotify(userId, gift);
                }
            }
        }
    }

    private void collectCandidates(List<Set<String>> target, Map<String, Set<String>> index, String value) {
        if (value != null) {
            Set<String> users = index.get(normalize(value));
            if (users != null && !users.isEmpty()) {
                target.add(users);
            }
        }
    }

    private void checkAndNotify(String userId, ListingEvent gift) {
        UserFilterDocument filter = filterCache.get(userId);
        if (filter != null) {
            if (isMatch(gift, filter)) {
                log.info("MATCH FOUND! User: {}, Gift: {}", userId, gift.getName());
                notificationService.sendMatchNotifications(userId, gift);
            } else {
                log.debug("User {} candidate but price/attributes didn't match fully", userId);
            }
        }
    }

    private boolean isMatch(ListingEvent gift, UserFilterDocument filter) {
        // Проверка моделей
        if (!isAttributeMatch(filter.getModels(), gift.getModel())) return false;
        // Проверка фонов
        if (!isAttributeMatch(filter.getBackdrops(), gift.getBackdrop())) return false;
        // Проверка символов
        if (!isAttributeMatch(filter.getSymbols(), gift.getSymbol())) return false;

        // ПРОВЕРКА ЦЕНЫ (обязательно!)
        if (filter.getMaxPrice() != null && gift.getPrice() != null) {
            if (gift.getPrice().compareTo(filter.getMaxPrice()) > 0) {
                log.debug("Price {} higher than filter max {}", gift.getPrice(), filter.getMaxPrice());
                return false;
            }
        }

        return true;
    }

    private boolean isAttributeMatch(List<String> filterValues, String giftValue) {
        if (filterValues == null || filterValues.isEmpty()) {
            return true; // Если фильтр не задан, значит подходит любой
        }
        if (giftValue == null) {
            return false;
        }
        String normalizedGiftValue = normalize(giftValue);
        return filterValues.stream()
                .map(this::normalize)
                .anyMatch(normalizedGiftValue::equals);
    }

    @Override
    public void updateFilter(UserFilterDocument filter) {
        String userId = filter.getUserId();
        removeFilter(userId);

        filterCache.put(userId, filter);
        indexAttributes(userId, filter.getModels(), modelIndex);
        indexAttributes(userId, filter.getBackdrops(), backdropIndex);
        indexAttributes(userId, filter.getSymbols(), symbolIndex);

        log.info("Filter updated/indexed for user: {}", userId);
    }

    private void indexAttributes(String userId, List<String> values, Map<String, Set<String>> index) {
        if (values != null) {
            values.forEach(val -> {
                String normalized = normalize(val);
                index.computeIfAbsent(normalized, k -> ConcurrentHashMap.newKeySet()).add(userId);
            });
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
            values.forEach(val -> {
                Set<String> set = index.get(normalize(val));
                if (set != null) {
                    set.remove(userId);
                }
            });
        }
    }

    private String normalize(String value) {
        return value == null ? "" : value.trim().toLowerCase();
    }

    @Override
    public Map<String, UserFilterDocument> getFilterCache() {
        return Collections.unmodifiableMap(filterCache);
    }
}