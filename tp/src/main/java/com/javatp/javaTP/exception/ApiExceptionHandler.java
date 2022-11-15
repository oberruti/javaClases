package com.javatp.javaTP.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class ApiExceptionHandler extends RuntimeException {

  @ExceptionHandler(value = {ApiRequestException.class})
  public ResponseEntity<Object> handleApiRequestException(ApiRequestException e) {
    ApiException exception = new ApiException(e.getMessage(), HttpStatus.BAD_REQUEST);

    return new ResponseEntity<>(exception, HttpStatus.BAD_REQUEST);
  } 
}
