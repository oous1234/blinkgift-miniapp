package com.blinkgift.core.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.util.Date;

@Data
public class SniperHistoryDto {
    private String id;
    private String name;
    private String model;
    private String backdrop;
    private String symbol;
    private BigDecimal price;
    private String currency;
    private String marketplace;
    private String address;
    private Date createdAt;
}