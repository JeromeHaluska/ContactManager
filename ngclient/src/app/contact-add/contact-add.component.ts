import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Contact } from '../contact';
import { ContactService } from '../contact.service';
import { Tag } from '../tag';

@Component({
  selector: 'app-contact-add',
  templateUrl: './contact-add.component.html',
  styleUrls: ['./contact-add.component.css']
})
export class ContactAddComponent implements OnInit {
  isLoading = false;
  isPrefill = false;
  errorMessage = '';
  tagPreview: Tag[] = [];
  contact: Contact = new Contact();

  constructor(private contactService: ContactService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    // Get contact data to prefill input fields
    let updateId = Number(this.route.snapshot.paramMap.get('id'));
    if (updateId > 0) {
      this.contactService.findById(updateId).subscribe(contact => {
        this.contact = contact;
        this.tagPreview = contact.tags;
        this.isPrefill = true;
      });
    }
  }

  onSubmit(f: NgForm): void {
    // Prepare api request
    let stream$: Observable<HttpResponse<void>>;
    this.isLoading = true;
    this.errorMessage = '';
    if (this.isPrefill) {
      // Update existing record
      this.contact.firstName = f.value.firstName;
      this.contact.lastName = f.value.lastName;
      this.contact.email = f.value.email;
      this.contact.phone = f.value.phone;
      this.contact.description = f.value.description;
      this.contact.tags = this.tagPreview;
      stream$ = this.contactService.update(this.contact);
    } else {
      // Create new record
      let newContact = new Contact(f.value.firstName, f.value.lastName, f.value.email, f.value.phone, f.value.description, this.tagPreview);
      stream$ = this.contactService.add(newContact);
    }
    stream$.subscribe({
      next: () => {
        this.isLoading = false;
        this.redirectBack();
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = error.status === 400 ? error.error : error.message;
      }
    });
  }

  updatePreviewTags($event: Event): void {
    let inputValue = ($event.target as HTMLInputElement).value;
    if (inputValue.endsWith(' ')) {
      inputValue.split(' ').forEach(tagTitle => {
        if (tagTitle === '') return;
        tagTitle = tagTitle.toLowerCase();
        let newTag = new Tag(tagTitle);
        if (!this.tagPreview.some(tag => tag.title === tagTitle)) { this.tagPreview.push(newTag) };
        inputValue = inputValue.replace(tagTitle, '');
      });
      ($event.target as HTMLInputElement).value = '';
    }
  }

  removePreviewTag(tagName: string) {
    this.tagPreview.forEach((tag, id) => {
      if (tagName === tag.title) {
        this.tagPreview.splice(id, 1);
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
