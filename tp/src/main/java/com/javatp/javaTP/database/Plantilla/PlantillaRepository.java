package com.javatp.javaTP.database.Plantilla;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.javatp.javaTP.database.Jugador.Jugador;

//examples https://javatechonline.com/spring-boot-mongodb-query-examples/
public interface PlantillaRepository extends MongoRepository<Plantilla, String> {

  @Query("{id :?0}")
  Optional<Plantilla> getPlantillaById(String id);

  ArrayList<Plantilla> findByClubID(String ClubID);

  Optional<Plantilla> findByIdAndClubID(String id, String ClubID);
}