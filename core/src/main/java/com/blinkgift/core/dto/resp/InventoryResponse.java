package com.blinkgift.core.dto.resp;

import com.blinkgift.core.dto.external.PosoGiftItem;
import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.List;

@Data
@AllArgsConstructor
public class InventoryResponse {
    private List<PosoGiftItem> items;
    private int total;
    private int limit;
    private int offset;
}