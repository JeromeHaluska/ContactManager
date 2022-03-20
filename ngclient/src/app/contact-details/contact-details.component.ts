import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Contact } from '../contact';
import { ContactService } from '../contact.service';

@Component({
  selector: 'app-contact-details',
  templateUrl: './contact-details.component.html',
  styleUrls: ['./contact-details.component.css']
})
export class ContactDetailsComponent implements OnInit {
  errorMessage: String = '';
  contact!: Contact;
  editMode: Boolean = false;

  constructor(private contactService: ContactService, private route: ActivatedRoute, private router: Router) { }

  deleteContact(contact: Contact) {
    if (confirm('You\'re about to remove contact #' + contact.id + '. Are you sure?')) {
      this.contactService.delete(contact);
      this.router.navigate(['/all']);
    }
  }

  ngOnInit(): void {
    this.contactService.findById(Number(this.route.snapshot.paramMap.get('id'))).subscribe(contact => {
      this.contact = contact;
    });

    this.contactService.findById(Number(this.route.snapshot.paramMap.get('id'))).subscribe({
      next: contact => {
        this.contact = contact;
      },
      error: error => {
        this.errorMessage = error.message;
        console.error('An error occurred while fetching contact list!', error);
      }
    });
  }
}
