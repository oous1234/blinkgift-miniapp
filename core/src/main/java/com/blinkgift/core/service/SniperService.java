package com.blinkgift.core.service;

import com.blinkgift.core.domain.UserFilterDocument;
import com.blinkgift.core.dto.SniperHistoryDto;
import java.util.List;

public interface SniperService {
    void updateUserFilters(UserFilterDocument filters);
    UserFilterDocument getUserFilters(String userId);
    List<SniperHistoryDto> getMatchHistory(String userId, int limit);
}