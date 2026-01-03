package com.blinkgift.core.dto.external;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class PortfolioHistory {
    @JsonProperty("12h")
    private List<HistoryPoint> h12;

    @JsonProperty("24h")
    private List<HistoryPoint> h24;

    @JsonProperty("7d")
    private List<HistoryPoint> d7;

    @JsonProperty("30d")
    private List<HistoryPoint> d30;
}
