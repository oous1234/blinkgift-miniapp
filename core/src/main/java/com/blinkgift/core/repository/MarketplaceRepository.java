package com.blinkgift.core.repository;

import com.blinkgift.core.dto.req.GiftSearchRequest;
import com.blinkgift.core.dto.resp.GiftShortResponse;
import com.blinkgift.core.dto.resp.MarketplaceGiftResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.LookupOperation;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
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
                        // Проверяем, есть ли запись в коллекции продаж прямо сейчас
                        .andExpression("size(active_sales) > 0").as("premarket")
                        .and("attributes").as("attributes"),
                Aggregation.skip((long) request.getOffset()),
                Aggregation.limit(request.getLimit() > 0 ? request.getLimit() : 20)
        );

        return mongoTemplate.aggregate(aggregation, "gifts_metadata", GiftShortResponse.class).getMappedResults();
    }
}