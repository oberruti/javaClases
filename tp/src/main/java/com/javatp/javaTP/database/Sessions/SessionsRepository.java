package com.javatp.javaTP.database.Sessions;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

//examples https://javatechonline.com/spring-boot-mongodb-query-examples/
public interface SessionsRepository extends MongoRepository<Sessions, String> {

  @Query("{sessionToken :?0}")
  Optional<Sessions> getSessionBySessionToken(String sessionToken);

}