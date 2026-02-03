package com.blinkgift.core.domain;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "collection_statistics")
public class CollectionStatisticsDocument {
    @Id
    private String collectionAddress;
    private Double floorPrice;
    private Long itemsCount;
}