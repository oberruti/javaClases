package com.javatp.javaTP.database.Arquero;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

//examples https://javatechonline.com/spring-boot-mongodb-query-examples/
public interface ArqueroRepository extends MongoRepository<Arquero, String> {

  @Query("{id :?0}")
  Optional<Arquero> getArqueroById(String id);

}