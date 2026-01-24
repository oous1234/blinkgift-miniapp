package com.blinkgift.core.dto.resp;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class GiftDetailsResponse {
    private GiftDto gift;
    private List<AttributeDto> attributes;
    @JsonProperty("market_stats")
    private List<MarketStatDto> marketStats;
    @JsonProperty("recent_sales")
    private List<RecentSaleDto> recentSales;

    @Data
    @Builder
    public static class GiftDto {
        private String name;
        private Integer id;
        private String slug;
        @JsonProperty("estimated_price_ton")
        private Double estimatedPriceTon;
        private String currency;

        @JsonProperty("is_offchain")
        private Boolean isOffchain;

        private OwnerDto owner;
    }

    @Data
    @Builder
    public static class OwnerDto {
        private String username;
    }

    @Data
    @Builder
    public static class AttributeDto {
        @JsonProperty("trait_type")
        private String traitType;
        private String value;
        @JsonProperty("rarity_percent")
        private Double rarityPercent;
    }

    @Data
    @Builder
    public static class MarketStatDto {
        private String type;
        private String label;
        @JsonProperty("items_count")
        private Integer itemsCount;
        @JsonProperty("floor_price")
        private Double floorPrice;
        @JsonProperty("avg_price_30d")
        private Double avgPrice30d;
        @JsonProperty("deals_count_30d")
        private Integer dealsCount30d;
    }

    @Data
    @Builder
    public static class RecentSaleDto {
        private String id;
        private String name;
        @JsonProperty("avatar_url")
        private String avatarUrl;
        private Double price;
        private String currency;
        private String platform;
        private String date;
        @JsonProperty("filter_category")
        private String filterCategory;
        @JsonProperty("trait_value")
        private String traitValue;
    }
}