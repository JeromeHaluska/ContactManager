package com.example.demo;

public class ContactNotFoundException extends RuntimeException {

    public ContactNotFoundException(Long id) {
        super("Could not find contact with id " + id);
    }
}
