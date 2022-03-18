package com.example.demo.controller;

import com.example.demo.ContactNotFoundException;
import com.example.demo.model.Contact;
import com.example.demo.repository.ContactRepository;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
public class ContactController {
    private final ContactRepository repository;

    public ContactController(ContactRepository contactRepository) {
        this.repository = contactRepository;
    }

    @GetMapping("/contacts/all")
	public Iterable<Contact> getContacts() {
		return repository.findAll();
	}

    @GetMapping("/contacts/{id}")
    Contact getById(@PathVariable Long id) {
        return repository.findById(id).orElseThrow(() -> new ContactNotFoundException(id));
    }

    @PostMapping("/contacts/add")
    void addContact(@RequestBody Contact contact) {
        repository.save(contact);
    }

    @DeleteMapping("/contacts/{id}")
    void deleteContact(@PathVariable Long id) {
        repository.deleteById(id);
    }
}
