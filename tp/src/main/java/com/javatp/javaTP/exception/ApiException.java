package com.javatp.javaTP.exception;

import org.springframework.http.HttpStatus;

public class ApiException {
  private final String message;
  private final HttpStatus httpStatus;

  public ApiException(String message, HttpStatus httpStatus) {
    this.message = message;
    this.httpStatus = httpStatus;
  }

  public String getMessage() {
    return this.message;
  }

  public HttpStatus geHttpStatus() {
    return this.httpStatus;
  }
}
