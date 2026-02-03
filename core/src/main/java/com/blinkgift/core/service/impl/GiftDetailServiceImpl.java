package com.blinkgift.core.service.impl;

import com.blinkgift.core.domain.*;
import com.blinkgift.core.dto.resp.FullGiftDetailsResponse;
import com.blinkgift.core.exception.ServiceException;
import com.blinkgift.core.repository.GiftHistoryRepository;
import com.blinkgift.core.service.GiftDetailService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GiftDetailServiceImpl implements GiftDetailService {

    private final MongoTemplate mongoTemplate;

    @Override
    public FullGiftDetailsResponse getGiftDetailsBySlug(String slug) {
        // 1. Ищем основной паспорт подарка в unique_gifts
        UniqueGiftDocument gift = mongoTemplate.findById(slug, UniqueGiftDocument.class);
        if (gift == null) throw new ServiceException("Gift not found: " + slug);

        // 2. Ищем активную продажу в current_sales
        CurrentSaleDocument sale = mongoTemplate.findOne(
                Query.query(Criteria.where("address").is(gift.getAddress())),
                CurrentSaleDocument.class
        );

        // 3. Собираем статистику по категориям
        Map<String, FullGiftDetailsResponse.ParameterStats> params = new HashMap<>();

        // Модель
        params.put("model", getAttributeStats("Model", gift.getModel(), gift.getCollectionAddress()));
        // Фон
        params.put("backdrop", getAttributeStats("Backdrop", gift.getBackdrop(), gift.getCollectionAddress()));
        // Символ
        params.put("symbol", getAttributeStats("Symbol", gift.getSymbol(), gift.getCollectionAddress()));
        // Коллекция целиком
        params.put("collection", getCollectionStats(gift.getCollectionAddress()));

        // 4. Сборка финального JSON
        return FullGiftDetailsResponse.builder()
                .giftSlug(gift.getId())
                .giftName(gift.getName())
                .giftNum(gift.getGiftNum())
                .giftMinted(gift.getGiftMinted())
                .giftTotal(gift.getGiftTotal())
                .giftAvatarLink("https://nft.fragment.com/gift/" + slug.toLowerCase() + ".medium.jpg")
                .model(gift.getModel())
                .modelRare(gift.getModelRare())
                .backdrop(gift.getBackdrop())
                .backdropRare(gift.getBackdropRare())
                .symbol(gift.getSymbol())
                .symbolRare(gift.getSymbolRare())
                // Флор всей коллекции
                .floorPriceTon(getCollectionFloorOnly(gift.getCollectionAddress()))
                .estimatedPriceTon(gift.getMarketData() != null && gift.getMarketData().getEstimatedPrice() != null ?
                        gift.getMarketData().getEstimatedPrice().doubleValue() : 0.0)
                // Если подарок на продаже
                .saleData(sale == null ? null : FullGiftDetailsResponse.SaleData.builder()
                        .marketplace(sale.getMarketplace())
                        .salePriceTon(Double.parseDouble(sale.getPrice()))
                        .url("https://getgems.io/nft/" + sale.getAddress())
                        .build())
                .parameters(params)
                .build();
    }

    /**
     * Получает статистику по конкретному атрибуту (модель/фон/символ)
     */
    private FullGiftDetailsResponse.ParameterStats getAttributeStats(String traitType, String value, String colAddr) {
        if (value == null) return null;

        // 1. Ищем данные о флоре в collection_attributes (наполняется getgems-parser)
        String attrId = generateAttributeId(colAddr, traitType, value);
        CollectionAttributeDocument attrDoc = mongoTemplate.findById(attrId, CollectionAttributeDocument.class);

        // 2. Ищем высчитанную аналитику (avg30d) в market_statistics (наполняется StatisticsWorker)
        MarketStatDocument marketStat = mongoTemplate.findOne(
                Query.query(Criteria.where("type").is(traitType.toLowerCase()).and("traitValue").is(value)),
                MarketStatDocument.class
        );

        // 3. Берем ВСЕ продажи из sold_gifts по этому значению
        List<SoldGiftDocument> trades = mongoTemplate.find(
                Query.query(Criteria.where(traitType.toLowerCase()).is(value))
                        .with(Sort.by(Sort.Direction.DESC, "soldAt")),
                SoldGiftDocument.class
        );

        return FullGiftDetailsResponse.ParameterStats.builder()
                .amount(attrDoc != null ? attrDoc.getItemsCount().longValue() : 0L)
                .floorPrice(attrDoc != null && attrDoc.getPrice() != null ? attrDoc.getPrice().doubleValue() : 0.0)
                .avg30dPrice(marketStat != null ? marketStat.getAvgPrice30d() : 0.0)
                .dealsCount30d(marketStat != null ? marketStat.getDealsCount30d() : 0)
                .lastTrades(mapTrades(trades))
                .build();
    }

    /**
     * Специальная обработка статистики всей коллекции
     */
    private FullGiftDetailsResponse.ParameterStats getCollectionStats(String colAddr) {
        CollectionStatisticsDocument stat = mongoTemplate.findById(colAddr, CollectionStatisticsDocument.class);

        List<SoldGiftDocument> trades = mongoTemplate.find(
                Query.query(Criteria.where("collectionAddress").is(colAddr))
                        .with(Sort.by(Sort.Direction.DESC, "soldAt")),
                SoldGiftDocument.class
        );

        return FullGiftDetailsResponse.ParameterStats.builder()
                .amount(stat != null ? stat.getItemsCount() : 0L)
                .floorPrice(stat != null ? stat.getFloorPrice() : 0.0)
                .avg30dPrice(0.0) // Можно добавить агрегацию по всей коллекции
                .dealsCount30d(0)
                .lastTrades(mapTrades(trades))
                .build();
    }

    private Double getCollectionFloorOnly(String addr) {
        CollectionStatisticsDocument stat = mongoTemplate.findById(addr, CollectionStatisticsDocument.class);
        return (stat != null && stat.getFloorPrice() != null) ? stat.getFloorPrice() : 0.0;
    }

    private List<FullGiftDetailsResponse.TradeInfo> mapTrades(List<SoldGiftDocument> trades) {
        return trades.stream().map(t -> FullGiftDetailsResponse.TradeInfo.builder()
                .giftSlug(t.getName().replace(" ", "").replace("#", "-"))
                .giftTonPrice(Double.parseDouble(t.getPrice()))
                .marketplace(t.getMarketplace())
                .date(t.getSoldAt().toString())
                .build()).collect(Collectors.toList());
    }

    private String generateAttributeId(String colAddr, String type, String val) {
        return colAddr + "_" + type.replaceAll("\\s+", "_") + "_" + val.replaceAll("\\s+", "_");
    }
}