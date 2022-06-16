package com.example.demo.controller;

import java.util.HashSet;
import java.util.Set;

import com.example.demo.ContactNotFoundException;
import com.example.demo.model.Contact;
import com.example.demo.model.Tag;
import com.example.demo.repository.ContactRepository;
import com.example.demo.repository.TagRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/contacts")
@CrossOrigin(origins = "http://localhost:4200")
public class ContactController {
    private final ContactRepository repository;
    private final TagRepository tagRepository;
    private Logger logger = LoggerFactory.getLogger(ContactController.class);

    public ContactController(ContactRepository contactRepository, TagRepository tagRepository) {
        this.repository = contactRepository;
        this.tagRepository = tagRepository;
    }

    private synchronized void persistTags(Contact contact) {
        // Persist unkown contact tags and prepare existing tags for saving
        Set<Tag> newTags = new HashSet<>();
        for (Tag tag : contact.getTags()) {
            boolean isExisting = tagRepository.existsByTitle(tag.getTitle());
            if (!isExisting) {
                logger.info("Create new tag record with title '" + tag.getTitle() + "'");
            }
            try {
                Tag newTag = isExisting ? tagRepository.findByTitle(tag.getTitle()) : tagRepository.save(tag);
                newTags.add(newTag);
            } catch (Exception e) {
                logger.info("Something went wrong with tag '" + tag.getTitle() + "' creation");
                logger.info(e.toString());
            }
        }
        contact.setTags(newTags);
    }

    @GetMapping
    public Page<Contact> get(@RequestParam(name = "page", defaultValue = "0") int page, @RequestParam(name = "size", defaultValue = "10") int size, @RequestParam(name = "tag", defaultValue = "") String tagTitle) {
        // Create page request to fetch a filtered contact list
        logger.info("Listing of contact records page #" + page + " with size " + size + (tagTitle.length() > 0 ? " and tag '" + tagTitle + "'" : "") + " requested");
        PageRequest pageRequest = PageRequest.of(page, size);
        Page<Contact> pageResult;
        Tag tagFilter = tagRepository.findByTitle(tagTitle);
        if (tagTitle.length() > 0 && tagFilter != null) {
            logger.info("Searching for contact records with tag #" + tagFilter.getId());
            pageResult = repository.findByTagId(pageRequest, tagFilter.getId());
        } else {
            pageResult = repository.findAll(pageRequest);
        }
        return new PageImpl<>(pageResult.getContent(), pageRequest, pageResult.getTotalElements());
    }

    @GetMapping("/{id}")
    public Contact getById(@PathVariable Long id) {
        logger.info("Info requested for contact record #" + id);
        return repository.findById(id).orElseThrow(() -> new ContactNotFoundException(id));
    }

    @PostMapping
    public ResponseEntity<Contact> add(@RequestBody Contact contact) {
        // Persist new contact and any unkown tags to avoid errors
        persistTags(contact);
        Contact newContact = repository.save(contact);
        logger.info("Saved contact record #" + newContact.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(newContact);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> update(@RequestBody Contact newContact, @PathVariable Long id) {
        logger.info("Update requested for contact record #" + id);
        logger.info(newContact.toString());
        // Update existing resource or throw an error
        Contact contact = repository.findById(id).orElseThrow(() -> new ContactNotFoundException(id));
        BeanUtils.copyProperties(newContact, contact);
        persistTags(contact);
        repository.save(contact);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        logger.info("Deletion requested for contact record #" + id);
        Contact contact = repository.findById(id).orElseThrow(() -> new ContactNotFoundException(id));
        if (contact.getTags().size() > 0) {
            contact.setTags(new HashSet<Tag>());
            repository.save(contact);
        }
        try {
            repository.deleteById(id);
        } catch (IllegalArgumentException e) {
            throw new ContactNotFoundException(id);
        }
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteAll() {
        logger.info("Deletion requested for all contact records");
        repository.deleteAll();
        return ResponseEntity.status(HttpStatus.OK).build();
    }
}