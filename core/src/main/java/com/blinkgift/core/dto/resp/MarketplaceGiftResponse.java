package com.blinkgift.core.dto.resp;

import lombok.Data;
import java.math.BigDecimal;
import java.time.Instant;

@Data
public class MarketplaceGiftResponse {
    private String id;
    private String address;
    private String name;
    private String collectionAddress;
    private String price;
    private Long priceNano;
    private String marketplace;
    private String seller;
    private boolean isOffchain;

    // Атрибуты из unique_gifts
    private String model;
    private String backdrop;
    private String symbol;

    // Оценка
    private BigDecimal estimatedPrice;
}