package com.blinkgift.core.domain;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "user_filters")
public class UserFilterDocument {
    @Id
    private String userId;

    private List<String> models;
    private List<String> backdrops;
    private List<String> symbols;

    private BigDecimal maxPrice;

    private Boolean notificationsEnabled;
}