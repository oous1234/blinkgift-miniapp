package com.blinkgift.core.dto.getgems;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class GetGemsItem {
    private String address;          // Адрес NFT (EQ...)
    private String name;             // Имя (Skull Flower #...)
    private String time;             // Строка времени
    private Long timestamp;          // Unix timestamp
    private String collectionAddress;// Адрес коллекции
    private String lt;               // Логическое время
    private String hash;             // Хеш транзакции

    // ДОБАВЛЯЕМ ЭТО ПОЛЕ, оно есть в твоем JSON
    private boolean isOffchain;

    private TypeData typeData;

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class TypeData {
        private String type;         // sold, transfer, mint
        private String price;        // "8"
        private String priceNano;    // "8000000000"
        private String newOwner;
        private String oldOwner;
        private String currency;     // "TON"
    }
}