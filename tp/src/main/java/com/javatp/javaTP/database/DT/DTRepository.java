package com.javatp.javaTP.database.Dt;

import java.util.ArrayList;
import java.util.Optional;


import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

//examples https://javatechonline.com/spring-boot-mongodb-query-examples/
public interface DtRepository extends MongoRepository<Dt, String> {

  @Query("{id :?0}")
  Optional<Dt> getDTById(String id);

  ArrayList<Dt> findByClubID(String ClubID);

  Optional<Dt> findByIdAndClubID(String id, String ClubID);

}