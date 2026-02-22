package com.blinkgift.core.service.impl;

import com.blinkgift.core.client.PythonGatewayClient;
import com.blinkgift.core.dto.external.SearchResponseDto;
import com.blinkgift.core.service.OwnerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class OwnerServiceImpl implements OwnerService {

    private final PythonGatewayClient pythonClient;

    @Override
    public SearchResponseDto searchOwners(String query, int limit) {
        log.info("Searching owners for query: {}, limit: {}", query, limit);
        try {
            return pythonClient.searchEntities(query, limit);
        } catch (Exception e) {
            log.error("Failed to search entities in Python Gateway: {}", e.getMessage());
            return SearchResponseDto.builder()
                    .query(query)
                    .results(java.util.Collections.emptyList())
                    .build();
        }
    }
}