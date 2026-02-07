package com.blinkgift.core.repository;
import com.blinkgift.core.domain.UserSyncStateDocument;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface UserSyncStateRepository extends MongoRepository<UserSyncStateDocument, String> {
    List<UserSyncStateDocument> findByStatus(UserSyncStateDocument.SyncStatus status);
}