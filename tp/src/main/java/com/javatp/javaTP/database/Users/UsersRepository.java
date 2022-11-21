package com.javatp.javaTP.database.Users;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

public interface UsersRepository extends MongoRepository<Users, String> {

    @Query("{id :?0}")
    Optional<Users> getUsersById(String id);
  
  }