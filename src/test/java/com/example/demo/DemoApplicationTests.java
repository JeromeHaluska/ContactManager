package com.example.demo;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.Collection;

import com.example.demo.controller.ContactController;
import com.example.demo.model.Tag;
import com.example.demo.model.Contact;
import com.example.demo.repository.ContactRepository;

import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class DemoApplicationTests {

	@Autowired
	private ContactController controller;

	@Autowired
	private ContactRepository repository;

	@Test
	void contextLoads() throws Exception {
		// Todo: Add real template testing (https://spring.io/guides/gs/testing-web/)
		// Check if controller is loaded
		assertThat(controller).isNotNull();

		// Check if database is cleared correctly
		repository.deleteAll();
		Collection<Contact> contactColl = (Collection<Contact>) repository.findAll();
		assertThat(contactColl.size()).isEqualTo(0);

		// Save a few contacts
		Contact[] contacts = {
			new Contact("Jack", "Bauer", "jack.bauer@gmail.com", "9999 9999", ""),
			new Contact("Chloe", "O'Brian", "chloe.obrian@example.com", "+61 2 9999 9999", ""),
			new Contact("Kim", "Bauer", "kim.bauer@web.de", "(02) 9999 9999", ""),
			new Contact("David", "Palmer", "david.palmer@gmx.com", "9999 9999", ""),
			new Contact("Michelle", "Dessler", "michelle.dessler@company.com", "+61 2 9999 9999", ""),
		};
		contacts[0].addTag(new Tag("favorites"));
		for (Contact contact : contacts) {
			repository.save(contact);
		}

		// Fetch all contacts and check size
		contactColl = (Collection<Contact>) repository.findAll();
		assertThat(contactColl.size()).isEqualTo(contacts.length);

		// Fetch an individual contact by ID
		Contact contact = repository.findById(contacts[0].getId()).get();
		assertThat(contact).isNotNull();
		assertThat(contact.getFirstName()).isEqualTo(contacts[0].getFirstName());

		// Fetch contacts by last name
		String needle = "Bauer";
		repository.findByLastName(needle).forEach(bauer -> {
			assertThat(bauer.getLastName()).isEqualTo(needle);
		});

		// Fetch contact by tag id
		repository.findByTagId(1L).forEach(bauer -> {
			assertThat(bauer.getLastName()).isEqualTo(needle);
		});
	}
}
