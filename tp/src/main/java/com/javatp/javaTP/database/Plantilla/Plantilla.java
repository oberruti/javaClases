package com.javatp.javaTP.database.Plantilla;

import org.springframework.data.annotation.Id;


public class Plantilla {

  @Id
  private String id;

  private String nombre;
  private String tactica;
  private Boolean esTitular;
  private String[] jugadoresIDs;

  private String clubID;

  public Plantilla() {}

  public Plantilla(String nombre, String tactica, Boolean esTitular, String[] jugadoresIds, String clubID) {
    this.nombre = nombre;
    this.tactica = tactica;
    this.esTitular = esTitular;
    this.jugadoresIDs = jugadoresIds;
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

  public String getTactica() {
    return this.tactica;
  }

  public void setTactica(String tactica) {
    this.tactica = tactica;
  }

  public Boolean getEsTitular() {
    return this.esTitular;
  }

  public void setEsTitular(Boolean esTitular) {
    this.esTitular = esTitular;
  }

  public String getClubID() {
    return this.clubID;
  }

  public void setClubID(String clubID) {
    this.clubID = clubID;
  }

  public String[] getJugadoresIDs() {
    return this.jugadoresIDs;
  }

  public void setJugadoresIDs(String[] jugadoresIDs) {
    this.jugadoresIDs = jugadoresIDs;
  }

  @Override
  public String toString() {
    return String.format(
        "Club[id=%s, nombre='%s', tactica='%s', esTitular='%s', clubID='%s']",
        id, nombre, tactica, esTitular, clubID);
  }

}