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
import java.util.Optional;

import static org.springframework.data.mongodb.core.aggregation.Aggregation.*;

@Repository
@RequiredArgsConstructor
public class MarketplaceRepository {
    private final MongoTemplate mongoTemplate;

    private static final String COLLECTION_METADATA = "gifts_metadata";
    private static final String COLLECTION_SALES = "current_sales";
    private static final String COLLECTION_UNIQUE_GIFTS = "unique_gifts";

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
                        .and("details.attributes.model").as("model")
                        .and("details.attributes.backdrop").as("backdrop")
                        .and("details.attributes.symbol").as("symbol")
                        .and("details.marketData.estimatedPrice").as("estimatedPrice")
        );

        return mongoTemplate.aggregate(aggregation, COLLECTION_SALES, MarketplaceGiftResponse.class).getMappedResults();
    }

    public List<GiftShortResponse> searchGiftsWithFilters(GiftSearchRequest request) {
        List<AggregationOperation> operations = new ArrayList<>();

        operations.add(match(buildCriteria(request)));
        operations.add(lookup(COLLECTION_SALES, "slug", "slug", "active_sales"));

        operations.add(project()
                .and("name").as("name")
                .and("slug").as("slug")
                .and("isOffchain").as("offchain")
                .and("estimatedPriceTon").as("price")
                .and("currency").as("currency")
                .and(ArrayOperators.Size.lengthOfArray("active_sales")).gt(0).as("premarket")
                .and(createImageExpression()).as("image")
                .and(extractAttribute("Model")).as("model")
                .and(extractAttribute("Backdrop")).as("backdrop")
                .and(extractAttribute("Rarity")).as("rarity")
        );

        operations.add(sort(resolveSort(request.getSortBy())));
        operations.add(skip((long) request.getOffset()));
        operations.add(limit(request.getLimit() > 0 ? request.getLimit() : 20));

        return mongoTemplate.aggregate(newAggregation(operations), COLLECTION_METADATA, GiftShortResponse.class).getMappedResults();
    }

    public long countGiftsWithFilters(GiftSearchRequest request) {
        Aggregation aggregation = newAggregation(
                match(buildCriteria(request)),
                count().as("total")
        );
        AggregationResults<Document> result = mongoTemplate.aggregate(aggregation, COLLECTION_METADATA, Document.class);
        return result.getUniqueMappedResult() != null ? ((Number) result.getUniqueMappedResult().get("total")).longValue() : 0;
    }

    private Criteria buildCriteria(GiftSearchRequest request) {
        List<Criteria> criteriaList = new ArrayList<>();

        Optional.ofNullable(request.getQuery()).filter(q -> !q.isEmpty())
                .ifPresent(q -> criteriaList.add(Criteria.where("name").regex(q, "i")));

        addListCriteria(criteriaList, "Model", request.getModels());
        addListCriteria(criteriaList, "Backdrop", request.getBackdrops());
        addListCriteria(criteriaList, "Symbol", request.getSymbols());
        addListCriteria(criteriaList, "Rarity", request.getRarities());

        if (request.getMinPrice() != null || request.getMaxPrice() != null) {
            Criteria priceCriteria = Criteria.where("estimatedPriceTon");
            if (request.getMinPrice() != null) priceCriteria.gte(request.getMinPrice());
            if (request.getMaxPrice() != null) priceCriteria.lte(request.getMaxPrice());
            criteriaList.add(priceCriteria);
        }

        return criteriaList.isEmpty() ? new Criteria() : new Criteria().andOperator(criteriaList.toArray(new Criteria[0]));
    }

    private void addListCriteria(List<Criteria> list, String traitType, List<String> values) {
        if (values != null && !values.isEmpty()) {
            list.add(Criteria.where("attributes").elemMatch(
                    Criteria.where("traitType").is(traitType).and("value").in(values)
            ));
        }
    }

    private AggregationExpression extractAttribute(String type) {
        return context -> new Document("$arrayElemAt", Arrays.asList(
                new Document("$map", new Document("input",
                        new Document("$filter", new Document("input", "$attributes")
                                .append("as", "a")
                                .append("cond", new Document("$eq", Arrays.asList("$$a.traitType", type)))))
                        .append("as", "f")
                        .append("in", "$$f.value")),
                0));
    }

    private AggregationExpression createImageExpression() {
        return context -> new Document("$concat", Arrays.asList(
                "https://nft.fragment.com/gift/",
                new Document("$toLower", "$slug"),
                ".medium.jpg"
        ));
    }

    private Sort resolveSort(String sortBy) {
        if (sortBy == null) return Sort.by(Sort.Direction.DESC, "_id");
        return switch (sortBy) {
            case "price_asc" -> Sort.by(Sort.Direction.ASC, "estimatedPriceTon");
            case "price_desc" -> Sort.by(Sort.Direction.DESC, "estimatedPriceTon");
            default -> Sort.by(Sort.Direction.DESC, "_id");
        };
    }
}