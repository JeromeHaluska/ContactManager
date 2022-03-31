import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Contact } from '../contact';

import { ContactService } from '../contact.service';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css']
})
export class ContactListComponent implements OnInit {
  errorMessage = '';
  contactsLoaded = false;
  contacts: Contact[] = [];
  filteredContacts: Contact[] = [];
  activeTagTitle = '';

  constructor(private contactService: ContactService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.activeTagTitle = this.route.snapshot.paramMap.get('tag') || this.activeTagTitle;
    this.contactService.findAll().subscribe({
      next: contacts => {
        if (this.activeTagTitle) {
          // Only show contacts with specific tag
          contacts.forEach(contact => {
            if (contact.tags.some(tag => tag.title === this.activeTagTitle)) { this.contacts.push(contact); }
          });
        } else {
          // Show all contacts
          this.contacts = contacts;
        }
        this.filteredContacts = this.contacts;
        this.contactsLoaded = true;
      },
      error: error => {
        this.errorMessage = error.message;
      }
    });
  }

  updateSearch($event: Event): void {
    let search: string = ($event.target as HTMLInputElement).value.toLowerCase();
    this.filteredContacts = [];
    this.contacts.forEach(contact => {
      let fullName = contact.firstName + ' ' + contact.lastName;
      // Check name, email, phone and id for a match
      if (fullName.toLocaleLowerCase().includes(search) ||
          contact.email.toLocaleLowerCase().includes(search) ||
          contact.phone.toLocaleLowerCase().includes(search) ||
          contact.id?.toString().includes(search)) {
        this.filteredContacts.push(contact);
      }
    });
  }
}
