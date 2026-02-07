package com.blinkgift.core.dto.resp;

import com.blinkgift.core.domain.UserSyncStateDocument;
import lombok.*;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InventoryResponse {
    private List<GiftItemDto> items;
    private long total;
    private int limit;
    private int offset;
    private SyncStatusDto sync;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GiftItemDto {
        private String id;
        private String slug;
        private String name;
        private String image;
        private Integer serialNumber;
        private String model;
        private String backdrop;
        private String symbol;
        private Double rarityPercent;
        private String acquiredAt;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SyncStatusDto {
        private UserSyncStateDocument.SyncStatus status;

        private boolean fullScanCompleted;

        private Integer totalItemsInTelegram;
        private String lastSyncAt;
    }
}