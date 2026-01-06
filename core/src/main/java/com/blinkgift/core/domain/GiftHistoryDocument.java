package com.blinkgift.core.domain;

import com.blinkgift.core.dto.getgems.GetGemsItem;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "gift_history")
public class GiftHistoryDocument {

    @Id
    private String id;

    @Indexed
    private String collectionAddress;

    @Indexed(unique = true) // Защита от дублей
    private String hash;

    private String lt;
    private String name;
    private Long timestamp;
    private String eventType; // mint, sold, transfer

    // Детали сделки
    private String price;
    private String currency;
    private String oldOwner;
    private String newOwner;

    // Конструктор маппинга
    public static GiftHistoryDocument fromDto(GetGemsItem dto) {
        GiftHistoryDocument doc = new GiftHistoryDocument();
        doc.setCollectionAddress(dto.getCollectionAddress());
        doc.setHash(dto.getHash());
        doc.setLt(dto.getLt());
        doc.setName(dto.getName());
        doc.setTimestamp(dto.getTimestamp());

        if (dto.getTypeData() != null) {
            doc.setEventType(dto.getTypeData().getType());
            doc.setPrice(dto.getTypeData().getPrice());
            doc.setCurrency(dto.getTypeData().getCurrency());
            doc.setOldOwner(dto.getTypeData().getOldOwner());
            doc.setNewOwner(dto.getTypeData().getNewOwner());
        }
        return doc;
    }
}