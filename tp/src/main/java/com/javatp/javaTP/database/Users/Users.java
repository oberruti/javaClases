package com.javatp.javaTP.database.Users;

import org.springframework.data.annotation.Id;

public class Users {
    
  @Id
  protected String id;

  private String name;
  
  private String email;

  public Users() {}

  public String getId() {
    return this.id;
  }

  public String getName() {
    return this.name;
  }

  public String getEmail() {
    return this.email;
  }

  public void setId(String id) {
    this.id = id;
  }

  public void setName(String name) {
    this.name = name;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  @Override
  public String toString() {
    return String.format(
        "User[id=%s, nombre='%s', email='%s']",
        this.id, this.name, this.email);
  }
}
