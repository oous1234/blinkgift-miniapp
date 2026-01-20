package com.blinkgift.core.repository;

import com.blinkgift.core.domain.MarketStatDocument;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface MarketStatRepository extends MongoRepository<MarketStatDocument, String> {
    Optional<MarketStatDocument> findByTypeAndTraitValue(String type, String traitValue);
}