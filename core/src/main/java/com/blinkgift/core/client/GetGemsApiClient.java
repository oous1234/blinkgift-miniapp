package com.blinkgift.core.client;

import com.blinkgift.core.config.GetGemsProxyConfig;
import com.blinkgift.core.dto.getgems.GetGemsHistoryResponse;
import com.blinkgift.core.dto.getgems.GetGemsNftInfoResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@FeignClient(
        name = "getGemsClient",
        url = "https://api.getgems.io/public-api",
        configuration = GetGemsProxyConfig.class
)
public interface GetGemsApiClient {

    @GetMapping("/v1/collection/history/{collectionAddress}")
    GetGemsHistoryResponse getHistory(
            @PathVariable("collectionAddress") String collectionAddress,
            @RequestParam("limit") int limit,
            @RequestParam("types") List<String> types,
            @RequestParam("reverse") boolean reverse,
            @RequestParam(value = "after", required = false) String cursor
    );

    @GetMapping("/v1/nft/{nftAddress}")
    GetGemsNftInfoResponse getNftInfo(@PathVariable("nftAddress") String nftAddress);

    @GetMapping("/v1/nft/history/{nftAddress}")
    GetGemsHistoryResponse getNftHistory(
            @PathVariable("nftAddress") String nftAddress,
            @RequestParam("limit") int limit,
            @RequestParam(value = "after", required = false) String cursor
    );
}