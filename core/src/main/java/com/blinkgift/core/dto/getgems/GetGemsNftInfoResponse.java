package com.blinkgift.core.dto.getgems;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class GetGemsNftInfoResponse {
    private boolean success;
    private NftItem response;

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class NftItem {
        private String address;
        private String name;
        private String description;
        private String image;
        private String collectionAddress;
        private String ownerAddress;
        private List<Attribute> attributes;
        private Sale sale;
    }

    @Data
    public static class Attribute {
        private String traitType;
        private String value;
    }

    @Data
    public static class Sale {
        private String type;
        private String fullPrice;
        private String currency;
    }
}