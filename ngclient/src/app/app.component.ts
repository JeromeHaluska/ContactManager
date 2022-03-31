import { Component, OnInit, enableProdMode } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Contact } from './contact';
import { ContactService } from './contact.service';
import { Tag } from './tag';
import { TagService } from './tag.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Contact Manager';
  tags: Tag[] = [];
  activeTagTitle = '';

  constructor(private contactService: ContactService, private tagService: TagService, private router: Router, private route: ActivatedRoute) {
    //enableProdMode()
    this.tagService.findAll().subscribe(tags => { this.tags = tags; })
  }

  private randomRange(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  ngOnInit(): void {
    this.router.events.subscribe((event: any) => {
      let r = this.route;
      while (r.firstChild) {
          r = r.firstChild
      }
      r.params.subscribe(params => {
          this.activeTagTitle = params['tag'] || '';
      });
    });
  }

  resetDb(recordCount: number = 0): void {
    let contacts: Contact[] = [];
    let firstNames: string[] = ['Jack', 'Chloe', 'Kim', 'David', 'Michelle', 'Liam', 'Emma'];
    let lastNames: string[] = ['Bauer', 'O\'Brian', 'Jones', 'David', 'Davis', 'Williams', 'Miller'];
    let mailProvider: string[] = ['company.com', 'gmx.com', 'web.de', 'example.com', 'gmail.com'];
    let phoneNumbers: string[] = ['9999 9999', '+61 2 9999 9999', '(02) 9999 9999'];
    let exampleTags: Tag[] = [new Tag('project_one'), new Tag('project_two'), new Tag('project_three'), new Tag('other'), new Tag('favorites'), new Tag('developer')];

    // Create list of randomized contacts
    while (contacts.length < recordCount) {
      // Assign random tags
      let tags: Tag[] = [];
      let maxTagCount: number = this.randomRange(0, exampleTags.length - 1);
      do {
        let tag = exampleTags[this.randomRange(0, exampleTags.length - 1)];
        if (!tags.includes(tag)) { tags.push(tag); }
      } while (tags.length < maxTagCount);
      // Random contact data
      let firstName = firstNames[this.randomRange(0, firstNames.length - 1)];
      let lastName = lastNames[this.randomRange(0, lastNames.length - 1)];
      let email = (firstName + '.' + lastName).toLowerCase() + '@' + mailProvider[this.randomRange(0, mailProvider.length - 1)];
      let phone = phoneNumbers[this.randomRange(0, phoneNumbers.length - 1)];
      contacts.push(new Contact(firstName, lastName, email, phone, 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod', tags));
    }

    // Replace database entries and redirect to list component
    this.contactService.deleteAll().subscribe(() => {
      this.tagService.deleteAll().subscribe(() => {
        if (contacts.length) {
          this.contactService.addList(contacts).subscribe(() => {
            this.redirectTo('/all');
          });
        } else {
          this.redirectTo('/all');
        }
      });
    });
  }

  // Used to reload component when its already loaded
  redirectTo(url: string) {
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => this.router.navigate([url]));
  }
}
