package com.blinkgift.core.dto.external;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class PosoGiftItem {
    private String id;

    @JsonProperty("gift_id")
    private String giftId;

    private String title;
    private String slug;
    private int num;

    @JsonProperty("model_name")
    private String modelName;

    private String url;

    @JsonProperty("current_owner_id")
    private String currentOwnerId;

    @JsonProperty("gift_value")
    private GiftValue giftValue;

    // Добавьте остальные поля при необходимости (pattern_name, backdrop_name и т.д.)
}
