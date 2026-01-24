package com.blinkgift.core.service.impl;

import com.blinkgift.core.client.GetGemsApiClient;
import com.blinkgift.core.dto.getgems.GetGemsHistoryResponse;
import com.blinkgift.core.dto.getgems.GetGemsItem;
import com.blinkgift.core.dto.getgems.GetGemsNftInfoResponse;
import com.blinkgift.core.dto.resp.FullNftGiftResponse;
import com.blinkgift.core.exception.ServiceException;
import com.blinkgift.core.service.NftInformationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class NftInformationServiceImpl implements NftInformationService {

    private final GetGemsApiClient getGemsApiClient;

    @Override
    public FullNftGiftResponse getFullNftDetails(String nftAddress) {
        log.info("Fetching full details for NFT: {}", nftAddress);

        // 1. Получаем общую информацию об NFT
        GetGemsNftInfoResponse infoWrapper = getGemsApiClient.getNftInfo(nftAddress);

        if (infoWrapper == null || !infoWrapper.isSuccess() || infoWrapper.getResponse() == null) {
            log.error("Failed to fetch NFT info for address: {}", nftAddress);
            throw new ServiceException("NFT not found or Getgems API error");
        }

        // 2. Получаем историю (явно указываем List<GetGemsItem> вместо var)
        GetGemsHistoryResponse historyWrapper = getGemsApiClient.getNftHistory(nftAddress, 50, null);

        List<GetGemsItem> historyItems = Collections.emptyList();

        if (historyWrapper != null && historyWrapper.getResponse() != null) {
            List<GetGemsItem> items = historyWrapper.getResponse().getItems();
            if (items != null) {
                historyItems = items;
            }
        }

        // 3. Собираем финальный результат
        return FullNftGiftResponse.builder()
                .info(infoWrapper.getResponse())
                .history(historyItems)
                .build();
    }
}