import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ComponentType } from '@angular/cdk/portal';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, enableProdMode } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable, shareReplay } from 'rxjs';
import { Contact } from './contact';
import { ContactService } from './contact.service';
import { AlertDialogComponent } from './dialogs/alert-dialog/alert-dialog.component';
import { ResetDialogComponent } from './dialogs/reset-dialog/reset-dialog.component';
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

  // Get observable for layout breakpoints
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(result => result.matches),
    shareReplay()
  );

  constructor(private contactService: ContactService, private tagService: TagService, private router: Router, private route: ActivatedRoute,
      private breakpointObserver: BreakpointObserver, private dialog: MatDialog) {
    //enableProdMode()
    this.tagService.findAll().subscribe(tags => { this.tags = tags; })
  }

  ngOnInit(): void {
    this.router.events.subscribe(() => {
      let r = this.route;
      while (r.firstChild) {
          r = r.firstChild
      }
      r.params.subscribe(params => {
          this.activeTagTitle = params['tag'] || '';
      });
    });
  }

  deleteTag(tag: Tag) {
    // Open tag deletion confirmation dialog
    this.openDialog<boolean>(AlertDialogComponent, {
      data: { title: 'Warning', text: 'You\'re about to remove tag "' + tag.title + '" permanently. Continue?', showButtonDecline: true },
      width: '400px',
    }, (hasAccepted) => {
      if (hasAccepted) {
        this.tagService.delete(tag).subscribe({
          next: () => {
            // Reset tag filter
            this.router.navigate(['/all']);
          },
          error: (error: HttpErrorResponse) => {
            // Open error notification dialog
            this.openDialog<boolean>(AlertDialogComponent, {
              data: { title: 'An error occurred!', text: (error.status === 409 ? error.error : error.message) + '.', showButtonDecline: false },
              width: '400px',
            });
          }
        });
      }
    });
  }

  openResetDialog(): void {
    // Open tag deletion confirmation dialog
    this.openDialog<number>(ResetDialogComponent, {
      width: '400px',
    }, (recordCount) => {
      if (recordCount>-1) { this.resetDb(recordCount); }
    });
  }

  resetDb(recordCount: number = 0): void {
    let contacts: Contact[] = [];
    let firstNames: string[] = ['Jack', 'Chloe', 'Kim', 'David', 'Michelle', 'Liam', 'Emma', 'Robert', 'Matthew', 'Anthony', 'Paul', 'Nancy', 'Lisa', 'Betty', 'Sandra'];
    let lastNames: string[] = ['Bauer', 'O\'Brian', 'Jones', 'David', 'Davis', 'Williams', 'Miller', 'Smith', 'Garcia', 'Lopez', 'Harris', 'Clark', 'Nguyen', 'Adams', 'Baker'];
    let mailProvider: string[] = ['company.com', 'gmx.com', 'web.de', 'example.com', 'gmail.com'];
    let phoneNumbers: string[] = ['**** ****', '+61 **** ****', '(02) **** ****'];
    let exampleTags: Tag[] = [new Tag('project-one'), new Tag('project-two'), new Tag('project-three'), new Tag('other'), new Tag('favorites'), new Tag('developer')];

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
      let email = (firstName + '.' + lastName.replace(/[^a-z]/gi, '')).toLowerCase() + '@' + mailProvider[this.randomRange(0, mailProvider.length - 1)];
      let phone = phoneNumbers[this.randomRange(0, phoneNumbers.length - 1)].split('').map(c => { return c === '*' ? this.randomRange(1, 9) : c }).join('');
      contacts.push(new Contact(firstName, lastName, email, phone, 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod', tags));
    }

    // Replace database entries and redirect to list component
    this.contactService.deleteAll().subscribe(() => {
      this.tagService.deleteAll().subscribe(() => {
        if (contacts.length) {
          this.contactService.addList(contacts).subscribe(() => {
            this.router.navigate(['/all']);
          });
        } else {
          this.router.navigate(['/all']);
        }
      });
    });
  }
  
  private randomRange(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  private openDialog<D>(component: ComponentType<any>, options: MatDialogConfig, afterClosedFunc?: (value: D) => void) {
    let dialogRef = this.dialog.open(component, options);
    dialogRef.afterClosed().subscribe(afterClosedFunc!);
  }
}