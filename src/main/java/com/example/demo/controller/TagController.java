package com.example.demo.controller;

import com.example.demo.TagNotFoundException;
import com.example.demo.model.Tag;
import com.example.demo.repository.TagRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
public class TagController {
    private final TagRepository repository;
    private Logger logger = LoggerFactory.getLogger(TagController.class);

    public TagController(TagRepository tagRepository) {
        this.repository = tagRepository;
    }

    @GetMapping("/tags")
	public Iterable<Tag> get() {
        logger.info("Listing of all tag records requested");
		return repository.findAll();
	}

    @GetMapping("/tags/{id}")
    public Tag getById(@PathVariable Long id) {
        logger.info("Info requested for tag record #" + id);
        return repository.findById(id).orElseThrow(() -> new TagNotFoundException(id));
    }

    @PutMapping("/tags/{id}")
    public Tag update(@RequestBody Tag newTag, @PathVariable Long id) {
        logger.info("Update requested for tag record #" + id);
        logger.info(newTag.toString());
        return repository.findById(id).map(tag -> {
            BeanUtils.copyProperties(newTag, tag);
            return repository.save(tag);
        }).orElseGet(() -> {
            return add(newTag);
        });
    }

    @PostMapping("/tags")
    public Tag add(@RequestBody Tag tag) {
        if (repository.existsByTitle(tag.getTitle())) {
            logger.info("Creation of tag #" + tag.getId() + " skipped because a record with this title already exists");
            return repository.findByTitle(tag.getTitle());
        } else {
            Tag newTag = repository.save(tag);
            logger.info("Created tag record #" + newTag.getId());
            logger.info(newTag.toString());
            return newTag;
        }
    }

    @DeleteMapping("/tags/{id}")
    public void delete(@PathVariable Long id) {
        logger.info("Deletion requested for tag record #" + id);
        if (!repository.existsById(id)) { throw new TagNotFoundException(id); }
        try {
            repository.deleteById(id);
        } catch (IllegalArgumentException e) {
            throw new TagNotFoundException(id);
        }
    }

    @DeleteMapping("/tags")
    public void deleteAll() {
        logger.info("Deletion requested for all tag records");
        repository.deleteAll();
    }
}
