package com.blinkgift.core.service.impl;

import com.blinkgift.core.domain.SniperMatchDocument;
import com.blinkgift.core.domain.UserFilterDocument;
import com.blinkgift.core.dto.SniperHistoryDto;
import com.blinkgift.core.repository.SniperMatchRepository;
import com.blinkgift.core.repository.UserFilterRepository;
import com.blinkgift.core.service.FilterStreamPublisher;
import com.blinkgift.core.service.SniperService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SniperServiceImpl implements SniperService {

    private final UserFilterRepository filterRepository;
    private final SniperMatchRepository matchRepository;
    private final FilterStreamPublisher streamPublisher;

    @Override
    public void updateUserFilters(UserFilterDocument filters) {
        filters.setVersion(System.currentTimeMillis());
        filterRepository.save(filters);
        streamPublisher.publishUpdate(filters);
    }

    @Override
    public UserFilterDocument getUserFilters(String userId) {
        return filterRepository.findById(userId)
                .orElse(UserFilterDocument.builder().userId(userId).build());
    }

    @Override
    public List<SniperHistoryDto> getMatchHistory(String userId, int limit) {
        return matchRepository.findByUserIdOrderByCreatedAtDesc(userId, PageRequest.of(0, limit))
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private SniperHistoryDto mapToDto(SniperMatchDocument doc) {
        SniperHistoryDto dto = new SniperHistoryDto();
        dto.setId(doc.getId());
        dto.setName(doc.getGiftName());
        dto.setModel(doc.getModel());
        dto.setBackdrop(doc.getBackdrop());
        dto.setSymbol(doc.getSymbol());
        dto.setPrice(doc.getPrice());
        dto.setMarketplace(doc.getMarketplace());
        dto.setAddress(doc.getAddress());
        dto.setCreatedAt(doc.getCreatedAt());
        return dto;
    }
}