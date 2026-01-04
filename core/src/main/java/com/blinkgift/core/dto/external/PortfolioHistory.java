package com.blinkgift.core.dto.external;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class PortfolioHistory {
    private String range;

    @JsonProperty("data") // В JSON приходит поле "data"
    private List<HistoryPoint> data;
}