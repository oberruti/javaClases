package com.javatp.javaTP.database.Jugador;

import org.springframework.data.annotation.Id;

public class Jugador {

  @Id
  protected String id;

  protected String nombre;
  protected String liga;
  protected String nacionalidad;
  protected String posicion;
  protected String piernaBuena;
  protected Integer edad;


  protected String clubID;

  public Jugador() {}

  public Jugador(String nombre, String liga, String nacionalidad, String piernaBuena, Integer edad,
  String clubID) {
    this.nombre = nombre;
    this.liga = liga;
    this.nacionalidad = nacionalidad;
    this.piernaBuena = piernaBuena;
    this.edad = edad;
    this.clubID = clubID;
  }

  public String getId() {
    return this.id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public String getNombre() {
    return this.nombre;
  }

  public void setNombre(String nombre) {
    this.nombre = nombre;
  }

  public String getLiga() {
    return this.liga;
  }

  public void setLiga(String liga) {
    this.liga = liga;
  }

  public String getNacionalidad() {
    return this.nacionalidad;
  }

  public void setNacionalidad(String nacionalidad) {
    this.nacionalidad = nacionalidad;
  }

  public String getPosicion() {
    return this.posicion;
  }

  public void setPosicion(String posicion) {
    this.posicion = posicion;
  }

  public String getPiernaBuena() {
    return this.piernaBuena;
  }

  public void setPiernaBuena(String piernaBuena) {
    this.piernaBuena = piernaBuena;
  }

  public Integer getEdad() {
    return this.edad;
  }

  public void setEdad(Integer edad) {
    this.edad = edad;
  }

  public String getClubID() {
    return this.clubID;
  }

  public void setClubID(String clubID) {
    this.clubID = clubID;
  }

  @Override
  public String toString() {
    return String.format(
        "Jugador[id=%s, nombre='%s', liga='%s', nacionalidad='%s', posicion='%s', piernaBuena='%s', edad='%s', clubID='%s']",
        id, nombre, liga, nacionalidad, posicion, piernaBuena, edad, clubID);
  }

}