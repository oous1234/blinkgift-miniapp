package com.blinkgift.core.domain;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "market_statistics")
@CompoundIndex(def = "{'type': 1, 'traitValue': 1}", unique = true)
public class MarketStatDocument {
    @Id
    private String id;

    private String type;
    private String label;
    private String traitValue;

    private Integer itemsCount;
    private Double floorPrice;
    private Double avgPrice30d;
    private Integer dealsCount30d;
}