import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin, Observable, take } from 'rxjs';
import { Contact } from './contact';
import { ContactService } from './contact.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Contact Manager';

  constructor(private contactService: ContactService, private router: Router) { }

  private randomRange(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  resetDb(): void {
    let targetLength = 10;
    let contacts: Contact[] = [];
    let firstNames: string[] = ['Jack', 'Chloe', 'Kim', 'David', 'Michelle', 'Liam', 'Emma'];
    let lastNames: string[] = ['Bauer', 'O\'Brian', 'Jones', 'David', 'Davis', 'Williams', 'Miller'];
    let mailProvider: string[] = ['company.com', 'gmx.com', 'web.de', 'example.com', 'gmail.com'];
    //let phoneNumbers: String[] = ['9999 9999', '+61 2 9999 9999', '(02) 9999 9999'];

    // Create list of randomized contacts
    while (contacts.length < targetLength) {
      let firstName = firstNames[this.randomRange(0, firstNames.length - 1)];
      let lastName = lastNames[this.randomRange(0, lastNames.length - 1)];
      contacts.push(new Contact(
        firstName, lastName,
        (firstName + '.' + lastName).toLowerCase() + '@' + mailProvider[this.randomRange(0, mailProvider.length - 1)]
      ));
    }

    // Replace database entries and redirect to list component
    this.contactService.findAll().pipe(take(1)).subscribe((oldContacts: Contact[]) => {
      this.contactService.deleteList(oldContacts).subscribe(() => {
        this.contactService.addList(contacts).subscribe(() => {
          this.redirectTo('/all');
        });
      });
    });
  }

  // Used to reload component when its already loaded to see new 
  redirectTo(url: string) {
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => this.router.navigate([url]));
  }
}
