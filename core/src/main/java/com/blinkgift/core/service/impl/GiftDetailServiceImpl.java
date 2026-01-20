package com.blinkgift.core.service.impl;

import com.blinkgift.core.domain.GiftMetadataDocument;
import com.blinkgift.core.domain.MarketStatDocument;
import com.blinkgift.core.dto.resp.GiftDetailsResponse;
import com.blinkgift.core.exception.ServiceException;
import com.blinkgift.core.repository.GiftMetadataRepository;
import com.blinkgift.core.repository.MarketStatRepository;
import com.blinkgift.core.service.GiftDetailService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GiftDetailServiceImpl implements GiftDetailService {

    private final GiftMetadataRepository giftRepository;
    private final MarketStatRepository statRepository;

    @Override
    public GiftDetailsResponse getGiftDetailsBySlug(String slug) {
        GiftMetadataDocument doc = giftRepository.findBySlug(slug)
                .orElseThrow(() -> new ServiceException("Gift not found with slug: " + slug));

        return GiftDetailsResponse.builder()
                .gift(mapToGiftDto(doc))
                .attributes(mapToAttributeDtos(doc))
                .marketStats(collectMarketStats(doc))
                .build();
    }

    private GiftDetailsResponse.GiftDto mapToGiftDto(GiftMetadataDocument doc) {
        return GiftDetailsResponse.GiftDto.builder()
                .name(doc.getName())
                .id(doc.getGiftId())
                .slug(doc.getSlug())
                .estimatedPriceTon(doc.getEstimatedPriceTon())
                .currency(doc.getCurrency())
                .owner(GiftDetailsResponse.OwnerDto.builder()
                        .username(doc.getOwner().getUsername())
                        .build())
                .build();
    }

    private List<GiftDetailsResponse.AttributeDto> mapToAttributeDtos(GiftMetadataDocument doc) {
        return doc.getAttributes().stream()
                .map(attr -> GiftDetailsResponse.AttributeDto.builder()
                        .traitType(attr.getTraitType())
                        .value(attr.getValue())
                        .rarityPercent(attr.getRarityPercent())
                        .build())
                .collect(Collectors.toList());
    }

    private List<GiftDetailsResponse.MarketStatDto> collectMarketStats(GiftMetadataDocument doc) {
        List<GiftDetailsResponse.MarketStatDto> stats = new ArrayList<>();

        // Извлекаем значения атрибутов для поиска статистики
        String model = getAttrValue(doc, "Model");
        String backdrop = getAttrValue(doc, "Backdrop");
        String pattern = getAttrValue(doc, "Pattern");

        // 1. Статистика по отдельным атрибутам
        addStatIfPresent(stats, "model", model);
        addStatIfPresent(stats, "backdrop", backdrop);
        addStatIfPresent(stats, "pattern", pattern);

        // 2. Комбинированные статистики (Model + Backdrop)
        if (model != null && backdrop != null) {
            addStatIfPresent(stats, "model_backdrop", model + " + " + backdrop);
        }

        // 3. Полное комбо
        if (model != null && backdrop != null && pattern != null) {
            addStatIfPresent(stats, "full_combo", model + " + " + backdrop + " + " + pattern);
        }

        return stats;
    }

    private void addStatIfPresent(List<GiftDetailsResponse.MarketStatDto> list, String type, String traitValue) {
        if (traitValue == null) return;

        statRepository.findByTypeAndTraitValue(type, traitValue).ifPresent(s -> {
            list.add(GiftDetailsResponse.MarketStatDto.builder()
                    .type(s.getType())
                    .label(s.getLabel())
                    .itemsCount(s.getItemsCount())
                    .floorPrice(s.getFloorPrice())
                    .avgPrice30d(s.getAvgPrice30d())
                    .dealsCount30d(s.getDealsCount30d())
                    .build());
        });
    }

    private String getAttrValue(GiftMetadataDocument doc, String type) {
        return doc.getAttributes().stream()
                .filter(a -> a.getTraitType().equalsIgnoreCase(type))
                .map(GiftMetadataDocument.Attribute::getValue)
                .findFirst()
                .orElse(null);
    }
}