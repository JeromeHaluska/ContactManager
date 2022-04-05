package com.example.demo;

import java.util.ArrayList;

import javax.validation.ConstraintViolation;
import javax.validation.ConstraintViolationException;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

@ControllerAdvice
public class ApplicationExceptionAdvice {
    
    @ResponseBody
    @ExceptionHandler(ContactNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    String contactNotFoundHandler(ContactNotFoundException e) {
        return e.getMessage();
    }

    @ResponseBody
    @ExceptionHandler(ConstraintViolationException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    Object[] contactBadRequestHandler(ConstraintViolationException e) {
        ArrayList<String> errorMessages = new ArrayList<String>();
        for (ConstraintViolation<?> cv : e.getConstraintViolations()) {
            errorMessages.add(cv.getMessage());
        }
        return errorMessages.toArray(); 
    }

    @ResponseBody
    @ExceptionHandler(DataIntegrityViolationException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    String duplicateCreateRequest(DataIntegrityViolationException e) {
        return e.getMessage();
    }

    @ResponseBody
    @ExceptionHandler(TagNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    String tagNotFoundHandler(TagNotFoundException e) {
        return e.getMessage();
    }

    @ResponseBody
    @ExceptionHandler(TagIsReferencedException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    String tagIsReferencedHandler(TagIsReferencedException e) {
        return e.getMessage();
    }
}
