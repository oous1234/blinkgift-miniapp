package com.blinkgift.core.domain;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

@Data
@Document(collection = "gifts_metadata")
public class GiftMetadataDocument {
    @Id
    private String id;

    @Indexed(unique = true)
    private String slug;

    private Integer giftId;
    private String name;
    private Double estimatedPriceTon;
    private String currency;

    // Новое поле для хранения статуса оффчейн-транзакции
    private Boolean isOffchain;

    private OwnerInfo owner;
    private List<Attribute> attributes;

    @Data
    public static class OwnerInfo {
        private String username;
    }

    @Data
    public static class Attribute {
        private String traitType;
        private String value;
        private Double rarityPercent;
    }
}