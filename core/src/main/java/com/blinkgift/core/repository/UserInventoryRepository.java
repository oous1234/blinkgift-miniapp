package com.blinkgift.core.repository;
import com.blinkgift.core.domain.UserInventoryDocument;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface UserInventoryRepository extends MongoRepository<UserInventoryDocument, String> {

    List<UserInventoryDocument> findByUserId(String userId, Pageable pageable);

    Optional<UserInventoryDocument> findByUserIdAndId(String userId, String giftId);

    void deleteByUserIdAndId(String userId, String giftId);

    long countByUserId(String userId);
}