// OwnerApiResponse.java
package com.blinkgift.core.dto.external;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class OwnerApiResponse {
    private String id;

    @JsonProperty("owner_type")
    private String ownerType;

    @JsonProperty("telegram_type")
    private String telegramType;

    @JsonProperty("telegram_id")
    private Long telegramId;

    private String username;
    private List<String> usernames;
    private String name;

    @JsonProperty("owner_address")
    private String ownerAddress;

    @JsonProperty("updated_at")
    private String updatedAt;

    private Boolean verified;
    private Boolean pidorased;

    @JsonProperty("gifts_count")
    private Integer giftsCount;

    @JsonProperty("portfolio_value")
    private PortfolioValue portfolioValue;

    @JsonProperty("portfolio_history")
    private PortfolioHistory portfolioHistory;
}