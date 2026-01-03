package com.blinkgift.core.dto.external;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class PortfolioValue {
    private PriceData portals;
    private PriceData tonnel;
    private PriceData getgems;
    private PriceData telegram;
    private PriceData average;
}
