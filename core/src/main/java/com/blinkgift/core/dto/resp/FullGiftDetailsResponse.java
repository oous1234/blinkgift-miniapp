package com.blinkgift.core.dto.resp;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FullGiftDetailsResponse {
    private String giftSlug;
    private String giftName;
    private Integer giftNum;
    private Integer giftMinted;
    private Integer giftTotal;
    private String giftAvatarLink;

    // Атрибуты и редкость
    private String model;
    private Integer modelRare;
    private String backdrop;
    private Integer backdropRare;
    private String symbol;
    private Integer symbolRare;

    // Цены
    private Double floorPriceTon;
    private Double estimatedPriceTon;

    private SaleData saleData;
    private Map<String, ParameterStats> parameters;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SaleData {
        private String marketplace;
        private Double salePriceTon;
        private String url;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ParameterStats {
        private Long amount;
        private Double floorPrice;
        private Double avg30dPrice;
        private Integer dealsCount30d;
        private List<TradeInfo> lastTrades;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TradeInfo {
        private String giftSlug;
        private Double giftTonPrice;
        private String marketplace;
        private String date;
    }
}