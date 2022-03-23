import { Component, OnInit } from '@angular/core';
import { Contact } from '../contact';

import { ContactService } from '../contact.service';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css']
})
export class ContactListComponent implements OnInit {
  errorMessage: string = '';
  searchQuery: string = '';
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
}
