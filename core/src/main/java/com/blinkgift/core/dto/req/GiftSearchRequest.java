package com.blinkgift.core.dto.req;

import lombok.Data;
import java.util.List;

@Data
public class GiftSearchRequest {
    private String query;
    private Integer giftId;
    private List<String> models;
    private List<String> backdrops;
    private List<String> symbols;
    private List<String> rarities;
    private Double minPrice;
    private Double maxPrice;
    private String sortBy;
    private int limit = 20;
    private int offset = 0;
}