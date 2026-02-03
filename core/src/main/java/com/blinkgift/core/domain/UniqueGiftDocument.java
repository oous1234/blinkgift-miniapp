package com.blinkgift.core.domain;

import jakarta.persistence.Id;
import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;

@Data
@Document(collection = "unique_gifts")
public class UniqueGiftDocument {
    @Id
    private String id;
    private String name;
    private String address;
    private Integer giftNum;
    private Integer giftMinted;
    private Integer giftTotal;
    private String collectionAddress;
    private String model;
    private Integer modelRare;
    private String backdrop;
    private Integer backdropRare;
    private String symbol;
    private Integer symbolRare;
    private MarketData marketData;

    @Data
    public static class MarketData {
        private BigDecimal collectionFloorPrice;
        private BigDecimal estimatedPrice;
        private BigDecimal modelFloorPrice;
    }
}