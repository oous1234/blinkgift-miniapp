package com.blinkgift.core.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class GiftItem {
    private String id;
    private String name;
    private String collection;
    private String image;
    private String rarity; // Можно сделать Enum, но String проще для старта
    private BigDecimal floorPrice;
    private BigDecimal purchasePrice;
    private String background;
    private int quantity;
    private String lastSaleDate;
}