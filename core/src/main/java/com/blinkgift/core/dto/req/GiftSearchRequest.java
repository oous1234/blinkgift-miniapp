package com.blinkgift.core.dto.req;

import lombok.Data;

@Data
public class GiftSearchRequest {
    private String collection;
    private String model;
    private String pattern;
    private String backdrop;
    private Integer giftId;
}