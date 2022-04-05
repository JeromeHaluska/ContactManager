package com.example.demo;

public class TagIsReferencedException extends RuntimeException {

    public TagIsReferencedException(Long id) {
        super("Tag with id " + id + " is still used in one ore more contacts");
    }
}
