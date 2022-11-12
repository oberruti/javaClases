package com.javatp.javaTP.database.JugadorCampo;

import com.javatp.javaTP.database.Jugador.Jugador;


public class JugadorCampo extends Jugador {
  private Integer ritmo;
  private Integer tiro;
  private Integer pase;
  private Integer regate;
  private Integer defensa;
  private Integer fisico;
  
  public JugadorCampo() {}

  public JugadorCampo(String nombre, String liga, String nacionalidad, String piernaBuena,
  Integer edad, Integer ritmo, Integer tiro, Integer pase,
  Integer regate, Integer defensa, Integer fisico,
  String clubID) {
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
    this.clubID = clubID;
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

  @Override
  public String toString() {
    return String.format(
        "Club[id=%s, nombre='%s', liga='%s', nacionalidad='%s', posicion='%s', piernaBuena='%s', edad='%s', ritmo='%s', tiro='%s', pase='%s', regate='%s', defensa='%s', fisico='%s', clubID='%s']",
        id, nombre, liga, nacionalidad, posicion, piernaBuena, edad, ritmo, tiro, pase, regate, defensa, fisico, clubID);
  }

}