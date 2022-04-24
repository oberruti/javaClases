package com.javatp.javaTP.database.DT;

import org.springframework.data.annotation.Id;


public class DT {

  @Id
  private String id;

  private String nombre;
  private String liga;
  private String nacionalidad;


  private String clubID;
  private String[] plantillaIDs;

  public DT() {}

  public DT(String nombre, String liga, String nacionalidad, String clubID, String[] plantillaIDs) {
    this.nombre = nombre;
    this.liga = liga;
    this.nacionalidad = nacionalidad;
    this.clubID = clubID;
    this.plantillaIDs = plantillaIDs;
  }

  public String getId() {
    return this.id;
  }

  public String getNombre() {
    return this.nombre;
  }

  public String getLiga() {
    return this.liga;
  }

  public String getNacionalidad() {
    return this.nacionalidad;
  }

  public String getClubID() {
    return this.clubID;
  }

  public String[] getPlantillaIDs() {
    return this.plantillaIDs;
  }

  public void setId(String id) {
    this.id = id;
  }

  public void setNombre(String nombre) {
    this.nombre = nombre;
  }

  public void setLiga(String liga) {
    this.liga = liga;
  }

  public void setNacionalidad(String nacionalidad) {
    this.nacionalidad = nacionalidad;
  }

  public void setClubID(String clubID) {
    this.clubID = clubID;
  }

  public void setPlantillaIDs(String[] plantillaIDs) {
    this.plantillaIDs = plantillaIDs;
  }

  @Override
  public String toString() {
    return String.format(
        "Club[id=%s, nombre='%s', liga='%s', nacionalidad='%s', clubID='%s', plantillaIDs='%s']",
        id, nombre, liga, nacionalidad, clubID, plantillaIDs);
  }

}