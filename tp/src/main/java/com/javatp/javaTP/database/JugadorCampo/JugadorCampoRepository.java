package com.javatp.javaTP.database.JugadorCampo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

//examples https://javatechonline.com/spring-boot-mongodb-query-examples/
public interface JugadorCampoRepository extends MongoRepository<JugadorCampo, String> {

  @Query("{id :?0}")
  Optional<JugadorCampo> getJugadorCampoById(String id);

}