import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Contact } from '../contact';

import { ContactService } from '../contact.service';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css']
})
export class ContactListComponent implements OnInit {
  errorMessage = '';
  contacts: Contact[] = [];
  filteredContacts: Contact[] = [];

  constructor(private contactService: ContactService) { }

  ngOnInit(): void {
    this.contactService.findAll().subscribe({
      next: contacts => {
        this.contacts = contacts as Contact[];
        this.filteredContacts = this.contacts;
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
      if (contact.firstName.toLocaleLowerCase().includes(search) ||
          contact.lastName.toLocaleLowerCase().includes(search) ||
          contact.email.toLocaleLowerCase().includes(search) ||
          contact.id.toString().includes(search)) {
        this.filteredContacts.push(contact);
      }
    });
  }
}
