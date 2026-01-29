package com.blinkgift.core.dto.resp;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.List;

@Data
@AllArgsConstructor
public class PagedResponse<T> {
    private List<T> items;
    private long total;
    private int limit;
    private int offset;
}