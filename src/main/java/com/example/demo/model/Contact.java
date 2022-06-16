package com.example.demo.model;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinTable;
import javax.persistence.Lob;
import javax.persistence.ManyToMany;
import javax.persistence.Version;
import javax.persistence.JoinColumn;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;

@Entity
public class Contact {
    
    @Version
    @NotNull
    private Long version;

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    @NotBlank(message = "First name is mandatory")
    private String firstName;

    @NotBlank(message = "Last name is mandatory")
    private String lastName;

    @NotBlank(message = "Email is mandatory")
    @Pattern(regexp = "^[^@]+@.+\\.[a-zA-Z]{2,}$", message = "A valid email is required")
    private String email;

    @NotBlank(message = "Phone number is mandatory")
    private String phone;

    @Lob
    @Column(name="description", length=512)
    @NotNull(message = "Description may not be null")
    private String description;

    @ManyToMany(cascade = CascadeType.MERGE)
    @JoinTable(
        name = "Contact_Tag", 
        joinColumns = { @JoinColumn(name = "contact_id") }, 
        inverseJoinColumns = { @JoinColumn(name = "tag_id") }
    )
    private Set<Tag> tags = new HashSet<>();

    protected Contact() {}

    public Contact(String firstName, String lastName, String email, String phone, String description) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phone = phone;
        this.description = description;
    }

    @Override
    public String toString() {
        return String.format(
            "Contact[id=%d, firstName='%s', lastName='%s', email='%s', phone='%s', description='%15.15s...', tags='%s']",
            id, firstName, lastName, email, phone, description, tags.toString());
    }

    public long getId() {
        return id;
    }

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

    public String getPhone() {
        return phone;
    }

    public void setPhone(String newPhone) {
        phone = newPhone;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String newDescription) {
        description = newDescription;
    }

    public Set<Tag> getTags() {
        return tags;
    }

    public void setTags(Set<Tag> newTags) {
        tags = newTags;
    }

    public void addTag(Tag tag) {
        tags.add(tag);
    }

    public void removeTag(Tag tag) {
        tags.remove(tag);
    }
}