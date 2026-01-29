package com.blinkgift.core.dto.resp;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class GiftShortResponse {
    private String slug;
    private Integer giftId;
    private String name;
    private Double estimatedPriceTon;
    private String model;
    private String backdrop;
    private String pattern;
    private String image;
}