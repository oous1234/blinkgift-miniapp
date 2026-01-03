package com.blinkgift.core.dto.external;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class GiftValue {
    @JsonProperty("slug_floor")
    private FloorPrice slugFloor;

    @JsonProperty("model_floor")
    private FloorPrice modelFloor;
}
