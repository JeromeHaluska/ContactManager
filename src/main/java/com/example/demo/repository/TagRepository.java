package com.example.demo.repository;

import com.example.demo.model.Tag;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.CrossOrigin;

@RepositoryRestResource(collectionResourceRel = "tag", path = "tags")
@CrossOrigin(origins = "http://localhost:4200")
public interface TagRepository extends CrudRepository<Tag, Long> {
    Boolean existsByTitle(String title);

    Tag findByTitle(String title);
}