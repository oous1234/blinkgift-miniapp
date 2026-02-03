package com.blinkgift.core.domain;

import jakarta.persistence.Id;
import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "current_sales")
public class CurrentSaleDocument {
    @Id
    private String id;
    private String address;
    private String name;
    private String price;
    private String marketplace;
    private String seller;
    private boolean isOffchain;
}
