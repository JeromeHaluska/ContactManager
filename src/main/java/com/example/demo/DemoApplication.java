package com.example.demo;

//import com.example.demo.model.Contact;
//import com.example.demo.repository.ContactRepository;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
//import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class DemoApplication {

	public static void main(String[] args) {
		SpringApplication.run(DemoApplication.class, args);
	}

	/* Populate database with example data
	@Bean
	boolean init(ContactRepository repository) {
		repository.deleteAll();
		Contact[] contacts = {
			new Contact("Jack", "Bauer", "jack.bauer@gmail.com"),
			new Contact("Chloe", "O'Brian", "chloe.obrian@example.com"),
			new Contact("Kim", "Bauer", "kim.bauer@web.de"),
			new Contact("David", "Palmer", "david.palmer@gmx.com"),
			new Contact("Michelle", "Dessler", "michelle.dessler@company.com"),
		};
		for (Contact contact : contacts) {
			repository.save(contact);
		}
		return true;
	}
	*/
}
