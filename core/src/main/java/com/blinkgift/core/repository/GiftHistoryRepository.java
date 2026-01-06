package com.blinkgift.core.repository;

import com.blinkgift.core.domain.GiftHistoryDocument;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface GiftHistoryRepository extends MongoRepository<GiftHistoryDocument, String> {
    boolean existsByHash(String hash);
}