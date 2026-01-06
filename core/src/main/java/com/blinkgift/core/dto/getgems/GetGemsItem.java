package com.blinkgift.core.dto.getgems;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class GetGemsItem {
    private String address;
    private String name;
    private String time; // ISO String
    private Long timestamp;
    private String collectionAddress;
    private String lt; // Logical Time in TON
    private String hash;
    private TypeData typeData;

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class TypeData {
        private String type; // sold, transfer, mint
        private String price;
        private String priceNano;
        private String newOwner;
        private String oldOwner;
        private String currency;
    }
}