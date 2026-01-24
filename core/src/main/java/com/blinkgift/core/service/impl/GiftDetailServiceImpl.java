package com.blinkgift.core.service.impl;

import com.blinkgift.core.domain.GiftHistoryDocument;
import com.blinkgift.core.domain.GiftMetadataDocument;
import com.blinkgift.core.dto.resp.GiftDetailsResponse;
import com.blinkgift.core.exception.ServiceException;
import com.blinkgift.core.repository.GiftHistoryRepository;
import com.blinkgift.core.repository.GiftMetadataRepository;
import com.blinkgift.core.repository.MarketStatRepository;
import com.blinkgift.core.service.GiftDetailService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GiftDetailServiceImpl implements GiftDetailService {

    private final GiftMetadataRepository giftRepository;
    private final MarketStatRepository statRepository;
    private final GiftHistoryRepository historyRepository;

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")
            .withZone(ZoneId.systemDefault());

    @Override
    public GiftDetailsResponse getGiftDetailsBySlug(String slug) {
        GiftMetadataDocument doc = giftRepository.findBySlug(slug)
                .orElseThrow(() -> new ServiceException("Gift not found with slug: " + slug));

        String model = getAttrValue(doc, "Model");
        String backdrop = getAttrValue(doc, "Backdrop");
        String pattern = getAttrValue(doc, "Pattern");

        return GiftDetailsResponse.builder()
                .gift(mapToGiftDto(doc))
                .attributes(mapToAttributeDtos(doc))
                .marketStats(collectMarketStats(model, backdrop, pattern))
                .recentSales(collectRecentSales(model, backdrop))
                .build();
    }

    private List<GiftDetailsResponse.MarketStatDto> collectMarketStats(String model, String backdrop, String pattern) {
        List<GiftDetailsResponse.MarketStatDto> stats = new ArrayList<>();

        addStatIfPresent(stats, "model", "Модель", model);
        addStatIfPresent(stats, "backdrop", "Фон", backdrop);
        addStatIfPresent(stats, "pattern", "Паттерн", pattern);

        if (model != null && backdrop != null) {
            addStatIfPresent(stats, "model_backdrop", "Модель + Фон", model + " + " + backdrop);
        }

        if (model != null && backdrop != null && pattern != null) {
            addStatIfPresent(stats, "full_combo", "Модель + Фон + Паттерн", model + " + " + backdrop + " + " + pattern);
        }

        return stats;
    }

    private List<GiftDetailsResponse.RecentSaleDto> collectRecentSales(String model, String backdrop) {
        List<GiftDetailsResponse.RecentSaleDto> sales = new ArrayList<>();

        if (model != null) {
            historyRepository.findTop10ByNameContainingAndEventTypeOrderByTimestampDesc(model, "sold")
                    .forEach(h -> sales.add(mapHistoryToDto(h, "model", model)));
        }

        if (backdrop != null) {
            historyRepository.findTop10ByNameContainingAndEventTypeOrderByTimestampDesc(backdrop, "sold")
                    .forEach(h -> sales.add(mapHistoryToDto(h, "backdrop", backdrop)));
        }

        if (model != null && backdrop != null) {
            historyRepository.findTop10ByNameContainingAndEventTypeOrderByTimestampDesc(model, "sold").stream()
                    .filter(h -> h.getName().contains(backdrop))
                    .forEach(h -> sales.add(mapHistoryToDto(h, "model_backdrop", model + " + " + backdrop)));
        }

        return sales;
    }

    private GiftDetailsResponse.RecentSaleDto mapHistoryToDto(GiftHistoryDocument h, String category, String traitValue) {
        String cleanName = h.getName().split("\\(")[0].trim();
        String slugForLink = cleanName.toLowerCase()
                .replace(" ", "")
                .replace("#", "-");

        return GiftDetailsResponse.RecentSaleDto.builder()
                .id(h.getAddress())
                .name(h.getName())
                .price(h.getPrice() != null ? Double.parseDouble(h.getPrice()) : 0.0)
                .currency(h.getCurrency() != null ? h.getCurrency() : "TON")
                .platform(h.getIsOffchain() != null && h.getIsOffchain() ? "PORTALS" : "GETGEMS")
                .date(DATE_FORMATTER.format(Instant.ofEpochSecond(h.getTimestamp())))
                .avatarUrl("https://fragment.com/gift/" + slugForLink)
                .filterCategory(category)
                .traitValue(traitValue)
                .build();
    }

    private void addStatIfPresent(List<GiftDetailsResponse.MarketStatDto> list, String type, String label, String traitValue) {
        if (traitValue == null) return;
        statRepository.findByTypeAndTraitValue(type, traitValue).ifPresent(s -> {
            list.add(GiftDetailsResponse.MarketStatDto.builder()
                    .type(s.getType())
                    .label(label)
                    .itemsCount(s.getItemsCount())
                    .floorPrice(s.getFloorPrice())
                    .avgPrice30d(s.getAvgPrice30d())
                    .dealsCount30d(s.getDealsCount30d())
                    .build());
        });
    }

    private GiftDetailsResponse.GiftDto mapToGiftDto(GiftMetadataDocument doc) {
        return GiftDetailsResponse.GiftDto.builder()
                .name(doc.getName())
                .id(doc.getGiftId())
                .slug(doc.getSlug())
                .estimatedPriceTon(doc.getEstimatedPriceTon())
                .currency(doc.getCurrency())
                .isOffchain(doc.getIsOffchain()) // Заполняем поле из документа
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

    private String getAttrValue(GiftMetadataDocument doc, String type) {
        return doc.getAttributes().stream()
                .filter(a -> a.getTraitType().equalsIgnoreCase(type))
                .map(GiftMetadataDocument.Attribute::getValue)
                .findFirst()
                .orElse(null);
    }
}