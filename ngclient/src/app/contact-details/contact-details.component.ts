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
  errorMessage: string = '';
  contact!: Contact;
  editMode: boolean = false;

  constructor(private contactService: ContactService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.contactService.findById(Number(this.route.snapshot.paramMap.get('id'))).subscribe({
      next: contact => {
        this.contact = contact;
      },
      error: error => {
        this.errorMessage = error.message;
      }
    });
  }

  editContact(contact: Contact) {
    this.router.navigate(['contacts/' + contact.id + '/edit']);
  }

  deleteContact(contact: Contact) {
    if (confirm('You\'re about to remove contact #' + contact.id + ' permanently. Continue?')) {
      this.contactService.delete(contact).subscribe(() => {
        this.router.navigate(['/all']);
      });
    }
  }
}
