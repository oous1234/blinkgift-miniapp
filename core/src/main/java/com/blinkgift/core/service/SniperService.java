package com.blinkgift.core.service;

import com.blinkgift.core.domain.UserFilterDocument;
import com.blinkgift.core.dto.SniperHistoryDto;
import com.blinkgift.core.repository.UserFilterRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SniperService {
    private final MongoTemplate mongoTemplate;
    private final UserFilterRepository filterRepository;
    private final SniperMatchingEngine matchingEngine;

    public void updateUserFilters(UserFilterDocument filters) {
        filterRepository.save(filters);
        // Обновляем фильтр в памяти матчинг-движка мгновенно
        matchingEngine.updatePlayerFilter(filters);
    }

    public UserFilterDocument getUserFilters(String userId) {
        return filterRepository.findById(userId)
                .orElse(UserFilterDocument.builder().userId(userId).build());
    }

    public List<SniperHistoryDto> getFilteredHistory(String userId) {
        UserFilterDocument filters = getUserFilters(userId);

        Query query = new Query();
        List<Criteria> criteriaList = new ArrayList<>();

        if (filters.getModels() != null && !filters.getModels().isEmpty()) {
            criteriaList.add(Criteria.where("model").in(filters.getModels()));
        }

        if (filters.getMaxPrice() != null) {
            criteriaList.add(Criteria.where("price").lte(filters.getMaxPrice()));
        }

        if (filters.getBackdrops() != null && !filters.getBackdrops().isEmpty()) {
            criteriaList.add(Criteria.where("backdrop").in(filters.getBackdrops()));
        }

        if (!criteriaList.isEmpty()) {
            query.addCriteria(new Criteria().andOperator(criteriaList.toArray(new Criteria[0])));
        }

        query.with(Sort.by(Sort.Direction.DESC, "createdAt")).limit(50);

        return mongoTemplate.find(query, SniperHistoryDto.class, "market_listings_history");
    }
}