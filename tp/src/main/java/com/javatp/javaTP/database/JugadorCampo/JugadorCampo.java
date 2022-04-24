package com.javatp.javaTP.database.JugadorCampo;

import org.springframework.data.annotation.Id;


public class JugadorCampo {

  @Id
  private String id;

  private String nombre;
  private String liga;
  private String nacionalidad;
  private String posicion;
  private String piernaBuena;
  private Integer edad;
  private Integer ritmo;
  private Integer tiro;
  private Integer pase;
  private Integer regate;
  private Integer defensa;
  private Integer fisico;


  private String clubID;
  private String[] plantillaIDs;

  public JugadorCampo() {}

  public JugadorCampo(String nombre, String liga, String nacionalidad, String piernaBuena,
  Integer edad, Integer ritmo, Integer tiro, Integer pase,
  Integer regate, Integer defensa, Integer fisico,
  String clubID, String[] plantillaIDs) {
    this.nombre = nombre;
    this.liga = liga;
    this.nacionalidad = nacionalidad;
    this.piernaBuena = piernaBuena;
    this.edad = edad;
    this.ritmo = ritmo;
    this.tiro = tiro;
    this.pase = pase;
    this.regate = regate;
    this.defensa = defensa;
    this.fisico = fisico;
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

  public Integer getRitmo() {
    return this.ritmo;
  }

  public void setRitmo(Integer ritmo) {
    this.ritmo = ritmo;
  }

  public Integer getTiro() {
    return this.tiro;
  }

  public void setTiro(Integer tiro) {
    this.tiro = tiro;
  }

  public Integer getPase() {
    return this.pase;
  }

  public void setPase(Integer pase) {
    this.pase = pase;
  }

  public Integer getRegate() {
    return this.regate;
  }

  public void setRegate(Integer regate) {
    this.regate = regate;
  }

  public Integer getDefensa() {
    return this.defensa;
  }

  public void setDefensa(Integer defensa) {
    this.defensa = defensa;
  }

  public Integer getFisico() {
    return this.fisico;
  }

  public void setFisico(Integer fisico) {
    this.fisico = fisico;
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
        "Club[id=%s, nombre='%s', liga='%s', nacionalidad='%s', posicion='%s', piernaBuena='%s', edad='%s', ritmo='%s', tiro='%s', pase='%s', regate='%s', defensa='%s', fisico='%s', clubID='%s', plantillaIDs='%s']",
        id, nombre, liga, nacionalidad, posicion, piernaBuena, edad, ritmo, tiro, pase, regate, defensa, fisico, clubID, plantillaIDs);
  }

}