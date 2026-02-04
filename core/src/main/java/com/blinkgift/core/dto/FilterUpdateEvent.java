package com.blinkgift.core.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FilterUpdateEvent {
    private String userId;
    private String action;
    private long version;
}