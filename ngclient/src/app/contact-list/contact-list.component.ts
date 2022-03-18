import { Component, OnInit } from '@angular/core';
import { Contact } from '../contact';

import { ContactService } from '../contact.service';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css']
})
export class ContactListComponent implements OnInit {
  contacts: Contact[] = [];

  constructor(private contactService: ContactService) {
    contactService.findAll().subscribe(
      contacts => this.contacts = contacts as Contact[]
    );
  }

  ngOnInit(): void {
  }

}
