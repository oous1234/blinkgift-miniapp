package com.blinkgift.core.repository;

import com.blinkgift.core.domain.SniperMatchDocument;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface SniperMatchRepository extends MongoRepository<SniperMatchDocument, String> {
    List<SniperMatchDocument> findByUserIdOrderByCreatedAtDesc(String userId, Pageable pageable);
}