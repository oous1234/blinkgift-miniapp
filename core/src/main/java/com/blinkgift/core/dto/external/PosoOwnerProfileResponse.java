package com.blinkgift.core.dto.external;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class PosoOwnerProfileResponse {
    private String id; // Это наш UUID
    private Long telegramId;
    private String username;
}