package com.blinkgift.core.repository;

import com.blinkgift.core.domain.GiftMetadataDocument;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface GiftMetadataRepository extends MongoRepository<GiftMetadataDocument, String> {
    Optional<GiftMetadataDocument> findBySlug(String slug);
}