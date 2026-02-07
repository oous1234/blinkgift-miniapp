package com.blinkgift.core.domain;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.Instant;
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "user_inventory")
@CompoundIndexes({
        @CompoundIndex(name = "user_acquired_idx", def = "{'userId': 1, 'acquiredAt': -1}"),
        @CompoundIndex(name = "user_model_filter_idx", def = "{'userId': 1, 'model': 1}"),
        @CompoundIndex(name = "user_rarity_filter_idx", def = "{'userId': 1, 'rarityPercent': 1}")
})
public class UserInventoryDocument {
    @Id
    private String id;
    @Indexed
    private String userId;
    @Indexed
    private String slug;
    private Integer serialNumber;
    private Instant acquiredAt;
    private String model;
    private String backdrop;
    private String symbol;
    private Double rarityPercent;
    private String name;
    private String image;
}