package com.blinkgift.core.repository;

import com.blinkgift.core.dto.resp.MarketplaceGiftResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.LookupOperation;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class MarketplaceRepository {

    private final MongoTemplate mongoTemplate;

    public List<MarketplaceGiftResponse> findLatestGifts(int limit) {
        // Настройка "Джойна" (Lookup)
        LookupOperation lookupUniqueGifts = LookupOperation.newLookup()
                .from("unique_gifts")      // из какой таблицы берем атрибуты
                .localField("address")     // поле в current_sales
                .foreignField("_id")       // поле в unique_gifts (там адрес обычно в _id)
                .as("details");            // временный массив для результата

        Aggregation aggregation = Aggregation.newAggregation(
                // 1. Сортировка по цене (или дате листинга)
                Aggregation.sort(Sort.Direction.ASC, "priceNano"),
                // 2. Ограничение выборки
                Aggregation.limit(limit),
                // 3. Соединение таблиц
                lookupUniqueGifts,
                // 4. Преобразование массива details в объект (разворачивание)
                Aggregation.unwind("details", true),
                // 5. Маппинг полей в финальный DTO
                Aggregation.project()
                        .and("address").as("address")
                        .and("name").as("name")
                        .and("price").as("price")
                        .and("priceNano").as("priceNano")
                        .and("marketplace").as("marketplace")
                        .and("isOffchain").as("isOffchain")
                        .and("details.attributes.model").as("model")
                        .and("details.attributes.backdrop").as("backdrop")
                        .and("details.attributes.symbol").as("symbol")
                        .and("details.marketData.estimatedPrice").as("estimatedPrice")
        );

        return mongoTemplate.aggregate(aggregation, "current_sales", MarketplaceGiftResponse.class).getMappedResults();
    }
}