package com.javatp.javaTP.database.Dt;

import org.springframework.data.annotation.Id;


public class Dt {

  @Id
  private String id;

  private String nombre;
  private String liga;
  private String nacionalidad;

  private String clubID;

  public Dt() {}

  public Dt(String nombre, String liga, String nacionalidad, String clubID) {
    this.nombre = nombre;
    this.liga = liga;
    this.nacionalidad = nacionalidad;
    this.clubID = clubID;
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

  @Override
  public String toString() {
    return String.format(
        "Club[id=%s, nombre='%s', liga='%s', nacionalidad='%s', clubID='%s']",
        id, nombre, liga, nacionalidad, clubID);
  }

}