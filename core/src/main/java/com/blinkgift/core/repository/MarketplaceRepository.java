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
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static org.springframework.data.mongodb.core.aggregation.Aggregation.*;

@Repository
@RequiredArgsConstructor
public class MarketplaceRepository {

    private final MongoTemplate mongoTemplate;

    private static final String COLLECTION_UNIQUE_GIFTS = "unique_gifts";
    private static final String COLLECTION_SALES = "current_sales";

    public List<MarketplaceGiftResponse> findLatestGifts(int limit) {
        Aggregation aggregation = newAggregation(
                sort(Sort.Direction.ASC, "priceNano"),
                limit(limit),
                lookup(COLLECTION_UNIQUE_GIFTS, "address", "_id", "details"),
                unwind("details", true),
                project()
                        .and("address").as("address")
                        .and("name").as("name")
                        .and("price").as("price")
                        .and("priceNano").as("priceNano")
                        .and("marketplace").as("marketplace")
                        .and("isOffchain").as("isOffchain")
                        .and("details.model").as("model")
                        .and("details.backdrop").as("backdrop")
                        .and("details.symbol").as("symbol")
                        .and("details.marketData.estimatedPrice").as("estimatedPrice")
        );
        return mongoTemplate.aggregate(aggregation, COLLECTION_SALES, MarketplaceGiftResponse.class).getMappedResults();
    }

    public List<GiftShortResponse> searchGiftsWithFilters(GiftSearchRequest request) {
        List<AggregationOperation> operations = new ArrayList<>();

        operations.add(match(buildCriteria(request)));
        operations.add(lookup(COLLECTION_SALES, "address", "address", "active_sales"));

        operations.add(project()
                .and("_id").as("slug")
                .and("name").as("name")
                .and("isOffchain").as("offchain")
                .and("marketData.estimatedPrice").as("price")
                .and("model").as("model")
                .and("backdrop").as("backdrop")
                .and("symbol").as("symbol")
                .and(ArrayOperators.Size.lengthOfArray("active_sales")).gt(0).as("premarket")
                .and(createImageExpression()).as("image")
        );

        operations.add(sort(resolveSort(request.getSortBy())));
        operations.add(skip((long) request.getOffset()));
        operations.add(limit(request.getLimit() > 0 ? request.getLimit() : 20));

        return mongoTemplate.aggregate(newAggregation(operations), COLLECTION_UNIQUE_GIFTS, GiftShortResponse.class).getMappedResults();
    }

    public long countGiftsWithFilters(GiftSearchRequest request) {
        Aggregation aggregation = newAggregation(
                match(buildCriteria(request)),
                count().as("total")
        );
        AggregationResults<Document> result = mongoTemplate.aggregate(aggregation, COLLECTION_UNIQUE_GIFTS, Document.class);
        return result.getUniqueMappedResult() != null ? ((Number) result.getUniqueMappedResult().get("total")).longValue() : 0;
    }

    private Criteria buildCriteria(GiftSearchRequest request) {
        List<Criteria> criteriaList = new ArrayList<>();

        if (request.getGiftId() != null) {
            criteriaList.add(Criteria.where("giftNum").is(request.getGiftId()));
        }

        if (StringUtils.hasText(request.getQuery())) {
            String q = request.getQuery().trim();
            List<Criteria> queryOR = new ArrayList<>();
            queryOR.add(Criteria.where("name").regex(q, "i"));
            queryOR.add(Criteria.where("_id").regex(q, "i"));
            if (q.matches("\\d+")) {
                queryOR.add(Criteria.where("giftNum").is(Integer.parseInt(q)));
            }
            criteriaList.add(new Criteria().orOperator(queryOR.toArray(new Criteria[0])));
        }

        if (request.getModels() != null && !request.getModels().isEmpty()) {
            criteriaList.add(Criteria.where("model").in(request.getModels()));
        }

        if (request.getBackdrops() != null && !request.getBackdrops().isEmpty()) {
            criteriaList.add(Criteria.where("backdrop").in(request.getBackdrops()));
        }

        if (request.getSymbols() != null && !request.getSymbols().isEmpty()) {
            criteriaList.add(Criteria.where("symbol").in(request.getSymbols()));
        }

        if (request.getMinPrice() != null || request.getMaxPrice() != null) {
            Criteria priceCriteria = Criteria.where("marketData.estimatedPrice");
            if (request.getMinPrice() != null) priceCriteria.gte(request.getMinPrice());
            if (request.getMaxPrice() != null) priceCriteria.lte(request.getMaxPrice());
            criteriaList.add(priceCriteria);
        }

        return criteriaList.isEmpty() ? new Criteria() : new Criteria().andOperator(criteriaList.toArray(new Criteria[0]));
    }

    private AggregationExpression createImageExpression() {
        return context -> new Document("$concat", Arrays.asList(
                "https://nft.fragment.com/gift/",
                new Document("$toLower", "$_id"),
                ".medium.jpg"
        ));
    }

    private Sort resolveSort(String sortBy) {
        if (sortBy == null) return Sort.by(Sort.Direction.DESC, "_id");
        return switch (sortBy) {
            case "price_asc" -> Sort.by(Sort.Direction.ASC, "marketData.estimatedPrice");
            case "price_desc" -> Sort.by(Sort.Direction.DESC, "marketData.estimatedPrice");
            default -> Sort.by(Sort.Direction.DESC, "_id");
        };
    }
}