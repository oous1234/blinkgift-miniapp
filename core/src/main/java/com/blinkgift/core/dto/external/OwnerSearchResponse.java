package com.blinkgift.core.dto.external;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class OwnerSearchResponse {
    private List<OwnerApiResponse> owners;
    private int total;
    private int limit;
    private int offset;
}