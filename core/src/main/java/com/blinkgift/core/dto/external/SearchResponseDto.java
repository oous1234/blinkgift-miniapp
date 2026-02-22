package com.blinkgift.core.dto.external;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SearchResponseDto {
    private String query;
    private List<SearchEntityDto> results;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SearchEntityDto {
        private Long id;
        private String username;
        private String title;
        private String type;
        private int nft_count;
        private boolean verified;
        private boolean scam;
        private boolean fake;
    }
}