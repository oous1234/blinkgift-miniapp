package com.blinkgift.core.repository;

import com.blinkgift.core.domain.UserInventoryDocument;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserInventoryRepository extends MongoRepository<UserInventoryDocument, String> {

    List<UserInventoryDocument> findByUserId(String userId, Pageable pageable);

    long countByUserId(String userId);

    @Query(value = "{ 'userId' : ?0 }", fields = "{ 'estimatedPrice' : 1 }")
    List<UserInventoryDocument> findAllPricesByUserId(String userId);

    void deleteByUserId(String userId);
}