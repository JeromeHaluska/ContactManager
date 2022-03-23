package com.example.demo.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Lob;

@Entity
public class Contact {
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;
    private String firstName;
    private String lastName;
    private String email;
    private String description;

    protected Contact() {}

    public Contact(String firstName, String lastName, String email, String description) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.description = description;
    }

    @Override
    public String toString() {
        return String.format(
            "Contact[id=%d, firstName='%s', lastName='%s', email='%s', description='%s']",
            id, firstName, lastName, email, description);
    }

    public long getId() {
        return id;
    }

    //@NotBlank(message = "First name is mandatory")
    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String newfirstName) {
        firstName = newfirstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String newLastName) {
        lastName = newLastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String newEmail) {
        email = newEmail;
    }

    @Lob
    @Column(name="description", length=512)
    public String getDescription() {
        return description;
    }

    public void setDescription(String newDescription) {
        description = newDescription;
    }
}