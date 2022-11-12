package com.javatp.javaTP.database.Club;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

//examples https://javatechonline.com/spring-boot-mongodb-query-examples/
public interface ClubRepository extends MongoRepository<Club, String> {

  @Query("{id :?0}")
  Optional<Club> getClubById(String id);

  @Query("{userID :?0}")
  Optional<Club> getClubByUserId(String userID);

}