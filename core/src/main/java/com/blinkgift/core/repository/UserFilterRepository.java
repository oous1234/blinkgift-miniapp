package com.blinkgift.core.repository;

import com.blinkgift.core.domain.UserFilterDocument;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserFilterRepository extends MongoRepository<UserFilterDocument, String> {
}