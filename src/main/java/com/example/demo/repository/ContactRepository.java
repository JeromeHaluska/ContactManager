package com.example.demo.repository;

import java.util.List;

import com.example.demo.model.Contact;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ContactRepository extends CrudRepository<Contact, Long> {
    
    List<Contact> findByLastName(String lastName);
}