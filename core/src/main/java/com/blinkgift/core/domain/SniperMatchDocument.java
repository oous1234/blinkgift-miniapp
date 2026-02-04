package com.blinkgift.core.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.util.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "sniper_matches")
public class SniperMatchDocument {
    @Id
    private String id;

    @Indexed
    private String userId;

    private String giftName;
    private String model;
    private String backdrop;
    private String symbol;
    private BigDecimal price;
    private String marketplace;
    private String address;

    @Indexed(expireAfter = "7d")
    private Date createdAt;
}