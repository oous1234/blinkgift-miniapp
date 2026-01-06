package com.blinkgift.core.service;

import com.blinkgift.core.client.GetGemsApiClient;
import com.blinkgift.core.domain.GiftHistoryDocument;
import com.blinkgift.core.dto.getgems.GetGemsHistoryResponse;
import com.blinkgift.core.dto.getgems.GetGemsItem;
import com.blinkgift.core.repository.GiftHistoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class GetGemsParsingService {

    private final GetGemsApiClient getGemsApiClient;
    private final GiftHistoryRepository historyRepository;

    // Async позволяет контроллеру вернуть ответ сразу, а парсинг пойдет в фоне
    @Async
    public void parseFullHistory(String collectionAddress) {
        log.info("START parsing history for collection: {}", collectionAddress);

        String cursor = null;
        boolean hasMore = true;
        int pageCounter = 0;
        int totalSaved = 0;

        // Типы событий, которые нам нужны
        List<String> types = List.of("sold", "transfer", "mint");

        try {
            while (hasMore) {
                // 1. Делаем запрос (reverse=true для хронологического порядка)
                GetGemsHistoryResponse wrapper = getGemsApiClient.getHistory(
                        collectionAddress,
                        100, // limit (максимум API)
                        types,
                        true, // reverse: true = old -> new
                        cursor
                );

                if (wrapper == null || !wrapper.isSuccess() || wrapper.getResponse() == null) {
                    log.error("API Error or empty response. Stop parsing.");
                    break;
                }

                List<GetGemsItem> items = wrapper.getResponse().getItems();

                if (items == null || items.isEmpty()) {
                    log.info("No more items received. Parsing finished.");
                    hasMore = false;
                } else {
                    // 2. Конвертируем в Entity
                    List<GiftHistoryDocument> documents = items.stream()
                            .map(GiftHistoryDocument::fromDto)
                            .collect(Collectors.toList());

                    // 3. Сохраняем пачкой (быстро)
                    // Используем try-catch на случай дублей, если перезапускаем парсер
                    try {
                        historyRepository.saveAll(documents);
                        totalSaved += documents.size();
                    } catch (DuplicateKeyException e) {
                        // Если пачка не вставилась из-за одного дубля, вставляем по одному
                        // (или используем bulkOps с upsert, но saveAll проще для старта)
                        saveOneByOne(documents);
                    } catch (Exception e) {
                        log.error("Error saving batch", e);
                    }

                    // 4. Обновляем курсор
                    cursor = wrapper.getResponse().getCursor();
                    pageCounter++;

                    log.info("Page {} processed. Saved items: {}. Next cursor: {}", pageCounter, items.size(), cursor);

                    // Если API не вернул курсор, значит страниц больше нет
                    if (cursor == null) {
                        hasMore = false;
                    }

                    // Небольшая пауза, чтобы не душить API слишком сильно (даже с прокси)
                    // Thread.sleep(100);
                }
            }
        } catch (Exception e) {
            log.error("Critical error during parsing", e);
        }

        log.info("FINISH parsing. Total records saved: {}", totalSaved);
    }

    private void saveOneByOne(List<GiftHistoryDocument> documents) {
        for (GiftHistoryDocument doc : documents) {
            try {
                if (!historyRepository.existsByHash(doc.getHash())) {
                    historyRepository.save(doc);
                }
            } catch (Exception ex) {
                // игнорируем ошибки отдельных записей
            }
        }
    }
}