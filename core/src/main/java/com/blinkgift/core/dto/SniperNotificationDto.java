package com.blinkgift.core.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SniperNotificationDto {
    private Long userId;
    private String giftName;
    private String model;
    private String price;
    private Integer dealScore;
    private String marketplace;
}