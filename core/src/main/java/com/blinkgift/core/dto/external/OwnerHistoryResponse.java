package com.blinkgift.core.dto.external;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class OwnerHistoryResponse {
    private String range;
    private List<HistoryPoint> data;
}