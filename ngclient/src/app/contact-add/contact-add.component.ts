import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Contact } from '../contact';
import { ContactService } from '../contact.service';

@Component({
  selector: 'app-contact-add',
  templateUrl: './contact-add.component.html',
  styleUrls: ['./contact-add.component.css']
})
export class ContactAddComponent implements OnInit {
  isLoading = false;
  isPrefill = false;
  errorMessage = '';
  contact: Contact = new Contact('', '', '');

  constructor(private contactService: ContactService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    // Get contact data to prefill input fields
    this.route.queryParams.subscribe(params => {
      if (!isNaN(parseInt(params['id']))) {
        this.contactService.findById(params['id']).subscribe(contact => {
          this.contact = contact;
          this.isPrefill = true
        });
      }
    });
  }

  onSubmit(f: NgForm): void {
    // Prepare api request
    let stream$: Observable<Contact>;
    this.isLoading = true;
    if (this.isPrefill) {
      // Update existing record
      this.contact.firstName = f.value.firstName;
      this.contact.lastName = f.value.lastName;
      this.contact.email = f.value.email;
      stream$ = this.contactService.update(this.contact);
    } else {
      // Create new record
      let newContact = new Contact(f.value.firstName, f.value.lastName, f.value.email);
      stream$ = this.contactService.add(newContact);
    }
    stream$.subscribe({
      next: () => {
        this.isLoading = false;
        this.redirectBack();
      },
      error: error => {
        this.errorMessage = error.message;
        console.log(this.errorMessage);
      }
    });
  }

  redirectBack(): void {
    if (this.isPrefill) {
      this.router.navigate(['/contacts/' + this.contact.id]);
    } else {
      this.router.navigate(['/all']);
    }
  }
}
