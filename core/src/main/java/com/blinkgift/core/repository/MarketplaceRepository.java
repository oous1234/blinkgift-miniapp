package com.blinkgift.core.repository;

import com.blinkgift.core.dto.req.GiftSearchRequest;
import com.blinkgift.core.dto.resp.GiftShortResponse;
import com.blinkgift.core.dto.resp.MarketplaceGiftResponse;
import lombok.RequiredArgsConstructor;
import org.bson.Document;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.*;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Repository
@RequiredArgsConstructor
public class MarketplaceRepository {

    private final MongoTemplate mongoTemplate;

    public List<MarketplaceGiftResponse> findLatestGifts(int limit) {
        LookupOperation lookupUniqueGifts = LookupOperation.newLookup()
                .from("unique_gifts")
                .localField("address")
                .foreignField("_id")
                .as("details");

        Aggregation aggregation = Aggregation.newAggregation(
                Aggregation.sort(Sort.Direction.ASC, "priceNano"),
                Aggregation.limit(limit),
                lookupUniqueGifts,
                Aggregation.unwind("details", true),
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

    public List<GiftShortResponse> searchGiftsWithFilters(GiftSearchRequest request) {
        List<Criteria> criteriaList = new ArrayList<>();

        if (request.getQuery() != null && !request.getQuery().isEmpty()) {
            criteriaList.add(Criteria.where("name").regex(request.getQuery(), "i"));
        }

        if (request.getModels() != null && !request.getModels().isEmpty()) {
            criteriaList.add(Criteria.where("attributes").elemMatch(
                    Criteria.where("traitType").is("Model").and("value").in(request.getModels())
            ));
        }

        if (request.getBackdrops() != null && !request.getBackdrops().isEmpty()) {
            criteriaList.add(Criteria.where("attributes").elemMatch(
                    Criteria.where("traitType").is("Backdrop").and("value").in(request.getBackdrops())
            ));
        }

        LookupOperation lookupSales = LookupOperation.newLookup()
                .from("current_sales")
                .localField("slug")
                .foreignField("slug")
                .as("active_sales");

        Aggregation aggregation = Aggregation.newAggregation(
                Aggregation.match(criteriaList.isEmpty() ? new Criteria() : new Criteria().andOperator(criteriaList.toArray(new Criteria[0]))),
                lookupSales,
                Aggregation.project()
                        .and("name").as("name")
                        .and("slug").as("slug")
                        .and("isOffchain").as("offchain")
                        .and("estimatedPriceTon").as("price")
                        .and("currency").as("currency")
                        .andExpression("size(active_sales) > 0").as("premarket")
                        // Формируем ссылку через Document Expression
                        .and(createImageExpression()).as("image")
                        // Извлекаем атрибуты
                        .and(createTraitExpression("Model")).as("model")
                        .and(createTraitExpression("Backdrop")).as("backdrop")
                        .and(createTraitExpression("Rarity")).as("rarity"),
                Aggregation.skip((long) request.getOffset()),
                Aggregation.limit(request.getLimit() > 0 ? request.getLimit() : 20)
        );

        return mongoTemplate.aggregate(aggregation, "gifts_metadata", GiftShortResponse.class).getMappedResults();
    }

    /**
     * Создает выражение для ссылки на картинку:
     * { $concat: [ "https://nft.fragment.com/gift/", { $toLower: "$slug" }, ".medium.jpg" ] }
     */
    private AggregationExpression createImageExpression() {
        return context -> new Document("$concat", Arrays.asList(
                "https://nft.fragment.com/gift/",
                new Document("$toLower", "$slug"),
                ".medium.jpg"
        ));
    }

    /**
     * Создает выражение для извлечения значения атрибута из массива attributes
     */
    private AggregationExpression createTraitExpression(String traitType) {
        return context -> new Document("$arrayElemAt", Arrays.asList(
                new Document("$map", new Document("input",
                        new Document("$filter", new Document("input", "$attributes")
                                .append("as", "a")
                                .append("cond", new Document("$eq", Arrays.asList("$$a.traitType", traitType)))))
                        .append("as", "f")
                        .append("in", "$$f.value")),
                0));
    }
}