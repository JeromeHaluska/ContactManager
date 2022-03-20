import { Component, OnInit } from '@angular/core';
import { Contact } from '../contact';

import { ContactService } from '../contact.service';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css']
})
export class ContactListComponent implements OnInit {
  errorMessage: String = '';
  contacts: Contact[] = [];

  constructor(private contactService: ContactService) {
    contactService.findAll().subscribe({
      next: contacts => {
        this.contacts = contacts as Contact[];
      },
      error: error => {
        this.errorMessage = error.message;
        console.error('An error occurred while fetching contact list!', error);
      }
    });
  }

  ngOnInit(): void {
  }

}
