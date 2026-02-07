package com.blinkgift.core.domain;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import java.math.BigDecimal;
import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "unique_gifts")
public class UniqueGiftDocument {
    @Id
    private String id;
    @Indexed
    private String name;
    private Integer giftNum;
    private Integer giftMinted;
    private Integer giftTotal;
    @Indexed
    private String collectionAddress;
    private String collectionName;
    private String model;
    private Integer modelRare;
    private String backdrop;
    private Integer backdropRare;
    private String symbol;
    private String address;
    private Integer symbolRare;
    // Цветовые параметры из MTProto
    private Integer backdropCenterColor;
    private Integer backdropEdgeColor;
    private Integer backdropPatternColor;
    // Ссылки на медиа
    private String modelUrl;
    private String patternUrl;
    private String pageUrl;
    // Экономические показатели
    private Long mintPriceStars;
    private String currency;
    private Boolean isResalable;
    // Оставляем владельца по требованию
    private OwnerInfo owner;
    private MarketData marketData;
    private Instant createdAt;
    private Instant updatedAt;
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OwnerInfo {
        private String telegramId;
        private String username;
        private String address;
    }
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MarketData {
        private BigDecimal collectionFloorPrice;
        private BigDecimal estimatedPrice;
        private BigDecimal modelFloorPrice;
        private Instant priceUpdatedAt;
    }
}