package com.example.demo.controller;

import com.example.demo.ContactNotFoundException;
import com.example.demo.model.Contact;
import com.example.demo.repository.ContactRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
    private Logger logger = LoggerFactory.getLogger(ContactController.class);

    public ContactController(ContactRepository contactRepository) {
        this.repository = contactRepository;
    }

    @GetMapping("/contacts/all")
	public Iterable<Contact> getContacts() {
        logger.info("Listing of all contact records requested");
		return repository.findAll();
	}

    @GetMapping("/contacts/{id}")
    Contact getById(@PathVariable Long id) {
        logger.info("Info requested for contact record #" + id);
        return repository.findById(id).orElseThrow(() -> new ContactNotFoundException(id));
    }

    @PutMapping("/contacts/{id}")
    Contact updateContact(@RequestBody Contact newContact, @PathVariable Long id) {
        logger.info("Update requested for contact record #" + id, newContact);
        return repository.findById(id).map(contact -> {
            contact.setFirstName(newContact.getFirstName());
            contact.setLastName(newContact.getLastName());
            contact.setEmail(newContact.getEmail());
            return repository.save(contact);
        }).orElseGet(() -> {
            return repository.save(newContact);
        });
    }

    @PostMapping("/contacts/add")
    void addContact(@RequestBody Contact contact) {
        Contact newContact = repository.save(contact);
        logger.info("Created contact record #" + newContact.getId(), newContact);
    }

    @DeleteMapping("/contacts/{id}")
    void deleteContact(@PathVariable Long id) {
        logger.info("Deletion requested for contact record #" + id);
        repository.deleteById(id);
    }
}
