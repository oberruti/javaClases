package com.javatp.javaTP.database.Arquero;

import org.springframework.data.annotation.Id;


public class Arquero {

  @Id
  private String id;

  private String nombre;
  private String liga;
  private String nacionalidad;
  private String posicion = "Arquero";
  private String piernaBuena;
  private Integer edad;
  private Integer estiramiento;
  private Integer paradas;
  private Integer saque;
  private Integer referencia;
  private Integer velocidad;
  private Integer posicionamiento;


  private String clubID;
  private String[] plantillaIDs;

  public Arquero() {}

  public Arquero(String nombre, String liga, String nacionalidad, String piernaBuena,
  Integer edad, Integer estiramiento, Integer paradas, Integer saque,
  Integer referencia, Integer velocidad, Integer posicionamiento,
  String clubID, String[] plantillaIDs) {
    this.nombre = nombre;
    this.liga = liga;
    this.nacionalidad = nacionalidad;
    this.piernaBuena = piernaBuena;
    this.edad = edad;
    this.estiramiento = estiramiento;
    this.paradas = paradas;
    this.saque = saque;
    this.referencia = referencia;
    this.velocidad = velocidad;
    this.posicionamiento = posicionamiento;
    this.plantillaIDs = plantillaIDs;
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

  public Integer getEstiramiento() {
    return this.estiramiento;
  }

  public void setEstiramiento(Integer estiramiento) {
    this.estiramiento = estiramiento;
  }

  public Integer getParadas() {
    return this.paradas;
  }

  public void setParadas(Integer paradas) {
    this.paradas = paradas;
  }

  public Integer getSaque() {
    return this.saque;
  }

  public void setSaque(Integer saque) {
    this.saque = saque;
  }

  public Integer getReferencia() {
    return this.referencia;
  }

  public void setReferencia(Integer referencia) {
    this.referencia = referencia;
  }

  public Integer getVelocidad() {
    return this.velocidad;
  }

  public void setVelocidad(Integer velocidad) {
    this.velocidad = velocidad;
  }

  public Integer getPosicionamiento() {
    return this.posicionamiento;
  }

  public void setPosicionamiento(Integer posicionamiento) {
    this.posicionamiento = posicionamiento;
  }

  public String getClubID() {
    return this.clubID;
  }

  public void setClubID(String clubID) {
    this.clubID = clubID;
  }

  public String[] getPlantillaIDs() {
    return this.plantillaIDs;
  }

  public void setPlantillaIDs(String[] plantillaIDs) {
    this.plantillaIDs = plantillaIDs;
  }

  @Override
  public String toString() {
    return String.format(
        "Club[id=%s, nombre='%s', liga='%s', nacionalidad='%s', posicion='%s', piernaBuena='%s', edad='%s', estiramiento='%s', paradas='%s', saque='%s', referencia='%s', velocidad='%s', posicionamiento='%s', clubID='%s', plantillaIDs='%s']",
        id, nombre, liga, nacionalidad, posicion, piernaBuena, edad, estiramiento, paradas, saque, referencia, velocidad, posicionamiento, clubID, plantillaIDs);
  }

}