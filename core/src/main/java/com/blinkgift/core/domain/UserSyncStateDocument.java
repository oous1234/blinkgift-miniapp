package com.blinkgift.core.domain;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "user_sync_state")
public class UserSyncStateDocument {
    @Id
    private String userId;
    private Instant lastSyncAt;

    private Boolean isFullScanCompleted;

    private Integer totalItemsCount;
    private SyncStatus status;
    private String lastCursor;

    public enum SyncStatus {
        PENDING,
        IN_PROGRESS,
        COMPLETED,
        FAILED
    }
}