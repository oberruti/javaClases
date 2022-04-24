package com.javatp.javaTP.database.Club;

import org.springframework.data.annotation.Id;


public class Club {

  @Id
  private String id;

  private String nombre;
  private String sigla;
  private String nacionalidad;


  private String userID;

  public Club() {}

  public Club(String nombre, String sigla, String nacionalidad, String userID) {
    this.nombre = nombre;
    this.sigla = sigla;
    this.nacionalidad = nacionalidad;
    this.userID = userID;
  }

  public String getId() {
    return this.id;
  }

  public String getNombre() {
    return this.nombre;
  }

  public String getSigla() {
    return this.sigla;
  }

  public String getNacionalidad() {
    return this.nacionalidad;
  }

  public String getUserID() {
    return this.userID;
  }

  public void setId(String id) {
    this.id = id;
  }

  public void setNombre(String nombre) {
    this.nombre = nombre;
  }

  public void setSigla(String sigla) {
    this.sigla = sigla;
  }

  public void setNacionalidad(String nacionalidad) {
    this.nacionalidad = nacionalidad;
  }

  public void setUserID(String userID) {
    this.userID = userID;
  }

  @Override
  public String toString() {
    return String.format(
        "Club[id=%s, nombre='%s', sigla='%s', nacionalidad='%s', userID='%s']",
        id, nombre, sigla, nacionalidad, userID);
  }

}