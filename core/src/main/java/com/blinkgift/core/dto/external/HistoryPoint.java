package com.blinkgift.core.dto.external;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class HistoryPoint {
    private String date;
    private PriceDetail getgems;
    private PriceDetail portals;
    private PriceDetail telegram;
    private PriceDetail tonnel;
    private PriceDetail average;
}