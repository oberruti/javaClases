package com.javatp.javaTP.database.Dtt;

import java.util.ArrayList;
import java.util.Optional;


import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

//examples https://javatechonline.com/spring-boot-mongodb-query-examples/
public interface DttRepository extends MongoRepository<Dtt, String> {

  @Query("{id :?0}")
  Optional<Dtt> getDTById(String id);

  ArrayList<Dtt> findByClubID(String ClubID);

  Optional<Dtt> findByIdAndClubID(String id, String ClubID);

}