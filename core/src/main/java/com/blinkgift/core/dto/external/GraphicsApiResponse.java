package com.blinkgift.core.dto.external;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class GraphicsApiResponse {
    // Этот объект соответствует полю "cap" в JSON
    private PortfolioHistory cap;
}