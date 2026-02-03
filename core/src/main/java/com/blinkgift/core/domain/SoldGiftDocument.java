package com.blinkgift.core.domain;

import jakarta.persistence.Id;
import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@Document(collection = "sold_gifts")
public class SoldGiftDocument {
    @Id
    private String id;
    private String address;
    private String name;
    private String price;
    private String marketplace;
    private Instant soldAt;
    private String model;
    private String backdrop;
    private String symbol;
}