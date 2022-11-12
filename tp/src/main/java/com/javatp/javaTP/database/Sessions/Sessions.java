package com.javatp.javaTP.database.Sessions;

import org.springframework.data.annotation.Id;


public class Sessions {

  @Id
  protected String id;

  private String sessionToken;
  
  private String userId;

  public Sessions() {}


  public String getSessionToken() {
    return this.sessionToken;
  }

  public String getUserId() {
    return this.userId;
  }
}