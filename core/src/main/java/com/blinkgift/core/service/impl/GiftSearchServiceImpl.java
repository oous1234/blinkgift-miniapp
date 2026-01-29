package com.blinkgift.core.service.impl;

import com.blinkgift.core.domain.GiftMetadataDocument;
import com.blinkgift.core.dto.req.GiftSearchRequest;
import com.blinkgift.core.dto.resp.GiftShortResponse;
import com.blinkgift.core.service.GiftSearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GiftSearchServiceImpl implements GiftSearchService {

    private final MongoTemplate mongoTemplate;

    @Override
    public List<GiftShortResponse> searchGifts(GiftSearchRequest request) {
        Query query = new Query();
        List<Criteria> criteriaList = new ArrayList<>();

        // 1. Поиск по КОЛЛЕКЦИИ (поле 'name' в документе)
        if (request.getCollection() != null && !request.getCollection().isEmpty()) {
            criteriaList.add(Criteria.where("name").is(request.getCollection()));
        }

        // 2. Поиск по номеру (giftId)
        if (request.getGiftId() != null) {
            criteriaList.add(Criteria.where("giftId").is(request.getGiftId()));
        }

        // 3. Поиск по атрибутам (Model, Backdrop, Pattern)
        if (request.getModel() != null) {
            criteriaList.add(Criteria.where("attributes").elemMatch(
                    Criteria.where("traitType").is("Model").and("value").is(request.getModel())
            ));
        }

        if (request.getBackdrop() != null) {
            criteriaList.add(Criteria.where("attributes").elemMatch(
                    Criteria.where("traitType").is("Backdrop").and("value").is(request.getBackdrop())
            ));
        }

        if (request.getPattern() != null) {
            criteriaList.add(Criteria.where("attributes").elemMatch(
                    Criteria.where("traitType").is("Pattern").and("value").is(request.getPattern())
            ));
        }

        if (!criteriaList.isEmpty()) {
            query.addCriteria(new Criteria().andOperator(criteriaList.toArray(new Criteria[0])));
        }

        query.limit(100);

        return mongoTemplate.find(query, GiftMetadataDocument.class)
                .stream()
                .map(this::mapToShortResponse)
                .collect(Collectors.toList());
    }

    private GiftShortResponse mapToShortResponse(GiftMetadataDocument doc) {
        return GiftShortResponse.builder()
                .slug(doc.getSlug())
                .giftId(doc.getGiftId())
                .name(doc.getName())
                .estimatedPriceTon(doc.getEstimatedPriceTon())
                .model(getAttrValue(doc, "Model"))
                .backdrop(getAttrValue(doc, "Backdrop"))
                .pattern(getAttrValue(doc, "Pattern"))
                .image("https://nft.fragment.com/gift/" + doc.getSlug() + ".medium.jpg")
                .build();
    }

    private String getAttrValue(GiftMetadataDocument doc, String type) {
        return doc.getAttributes().stream()
                .filter(a -> a.getTraitType().equalsIgnoreCase(type))
                .map(GiftMetadataDocument.Attribute::getValue)
                .findFirst()
                .orElse(null);
    }
}