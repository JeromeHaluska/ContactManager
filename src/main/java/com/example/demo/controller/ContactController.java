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
public class ContactController {
    private final ContactRepository repository;
    private final TagRepository tagRepository;
    private Logger logger = LoggerFactory.getLogger(ContactController.class);

    public ContactController(ContactRepository contactRepository, TagRepository tagRepository) {
        this.repository = contactRepository;
        this.tagRepository = tagRepository;
    }

    @GetMapping("/contacts")
	public Iterable<Contact> getAll() {
        logger.info("Listing of all contact records requested");
		return repository.findAll();
	}

    @GetMapping("/contacts/{id}")
    public Contact getById(@PathVariable Long id) {
        logger.info("Info requested for contact record #" + id);
        return repository.findById(id).orElseThrow(() -> new ContactNotFoundException(id));
    }

    @PutMapping("/contacts/{id}")
    public Contact update(@RequestBody Contact newContact, @PathVariable Long id) {
        String loggerPrefix = "[" + newContact.getFirstName().charAt(0) + newContact.getLastName().charAt(0) + "] ";
        logger.info(loggerPrefix + "Update requested for contact record #" + id);
        logger.info(newContact.toString());
        return repository.findById(id).map(contact -> {
            BeanUtils.copyProperties(newContact, contact);
            return add(contact);
        }).orElseGet(() -> {
            return add(newContact);
        });
    }

    @PostMapping("/contacts")
    public Contact add(@RequestBody Contact contact) {
        String loggerPrefix = "[" + contact.getFirstName().charAt(0) + contact.getLastName().charAt(0) + "] ";
        // Persist unkown contact tags and prepare existing tags for saving
        Set<Tag> newTags = new HashSet<>();
        for (Tag tag : contact.getTags()) {
            boolean isExisting = tagRepository.existsByTitle(tag.getTitle());
            logger.info(loggerPrefix + (isExisting ? "Use existing tag record for title '" + tag.getTitle() + "'" : "Create new tag record with title '" + tag.getTitle() + "'"));
            try {
                Tag newTag = isExisting ? tagRepository.findByTitle(tag.getTitle()) : tagRepository.save(tag);
                newTags.add(newTag);
            } catch (Exception e) {
                logger.info(loggerPrefix + "Something went wrong with tag '" + tag.getTitle() + "' creation");
            }
        }
        contact.setTags(newTags);
        // Persist new contact
        Contact newContact = repository.save(contact);
        logger.info(loggerPrefix + "Saved contact record #" + newContact.getId());
        return newContact;
    }

    @DeleteMapping("/contacts/{id}")
    public void delete(@PathVariable Long id) {
        logger.info("Deletion requested for contact record #" + id);
        if (!repository.existsById(id)) { throw new ContactNotFoundException(id); }
        try {
            repository.deleteById(id);
        } catch (IllegalArgumentException e) {
            throw new ContactNotFoundException(id);
        }
    }

    @DeleteMapping("/contacts")
    public void deleteAll() {
        logger.info("Deletion requested for all contact records");
        repository.deleteAll();
    }
}
