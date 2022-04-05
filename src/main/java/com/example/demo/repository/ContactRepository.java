package com.example.demo.repository;

import java.util.List;

import com.example.demo.model.Contact;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.CrossOrigin;


@RepositoryRestResource(collectionResourceRel = "contact", path = "contacts")
@CrossOrigin(origins = "http://localhost:4200")
public interface ContactRepository extends PagingAndSortingRepository<Contact, Long> {
    
    List<Contact> findByLastName(String lastName);

    @Query(value = "SELECT Contact.* FROM Contact JOIN Contact_Tag ON Contact.id = Contact_Tag.contact_id AND Contact_Tag.tag_id = :tagId JOIN Tag ON Contact_Tag.tag_id = Tag.id",
        countQuery = "SELECT count(*) FROM Contact_Tag WHERE Contact_Tag.tag_id = :tagId", nativeQuery = true)
    Page<Contact> findByTagId(Pageable pageable, @Param("tagId") Long id);

    @Query(value = "SELECT IF(COUNT(*) > 0, 'true', 'false') FROM Contact_Tag WHERE Contact_Tag.tag_id = :tagId LIMIT 1", nativeQuery = true)
    Boolean existsByTagId(@Param("tagId") Long id);
}