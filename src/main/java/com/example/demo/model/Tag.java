package com.example.demo.model;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.validation.constraints.NotBlank;

@Entity
public class Tag {
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    @NotBlank(message = "Title is mandatory")
    @Column(unique = true)
    private String title;

    @ManyToMany(mappedBy = "tags", cascade = CascadeType.MERGE)
    private Set<Contact> contacts = new HashSet<>();

    protected Tag() {}

    public Tag(String title) {
        this.title = title;
    }

    @Override
    public String toString() {
        return String.format("Tag[id=%d, title='%s']", id, title);
    }

    public long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }
}
