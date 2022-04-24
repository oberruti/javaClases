package com.javatp.javaTP.database.DT;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

//examples https://javatechonline.com/spring-boot-mongodb-query-examples/
public interface DTRepository extends MongoRepository<DT, String> {

  @Query("{id :?0}")
  Optional<DT> getDTById(String id);

}