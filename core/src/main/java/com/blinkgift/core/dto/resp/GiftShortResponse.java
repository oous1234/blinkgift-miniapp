package com.blinkgift.core.dto.resp;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GiftShortResponse {
    private String id;
    private String name;
    private String slug;
    private String image;
    private Double price;
    private String currency;

    @JsonProperty("is_offchain")
    private boolean offchain;

    @JsonProperty("is_premarket")
    private boolean premarket;

    private String model;
    private String backdrop;
    private String rarity;
}