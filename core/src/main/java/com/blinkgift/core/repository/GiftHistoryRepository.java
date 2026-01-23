package com.blinkgift.core.repository;

import com.blinkgift.core.domain.GiftHistoryDocument;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface GiftHistoryRepository extends MongoRepository<GiftHistoryDocument, String> {
    boolean existsByHash(String hash);

    List<GiftHistoryDocument> findTop10ByNameContainingAndEventTypeOrderByTimestampDesc(String namePart, String eventType);
}