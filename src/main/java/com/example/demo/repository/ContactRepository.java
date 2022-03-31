package com.example.demo.repository;

import java.util.List;

import com.example.demo.model.Contact;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ContactRepository extends CrudRepository<Contact, Long> {
    
    List<Contact> findByLastName(String lastName);

    @Query(value = "SELECT Contact.* FROM Contact JOIN Contact_Tag ON Contact.id = Contact_Tag.contact_id AND Contact_Tag.tag_id = :tagId JOIN Tag ON Contact_Tag.tag_id = Tag.id", nativeQuery = true)
    List<Contact> findByTagId(@Param("tagId") Long id);
}