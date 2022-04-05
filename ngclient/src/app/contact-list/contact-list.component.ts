import { ComponentType } from '@angular/cdk/portal';
import { Component, OnInit, ViewChildren } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSelectChange } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';

import { Contact } from '../contact';
import { ContactService } from '../contact.service';
import { ContactDataSource } from '../data-sources/contact-data-source';
import { AlertDialogComponent } from '../dialogs/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css']
})
export class ContactListComponent implements OnInit {
  errorMessage = '';
  contactsLoaded = false;
  contacts: Contact[] = [];
  filteredContacts: Contact[] = [];
  activeTagTitle = '';
  searchValue = '';
  // Column Multiselection
  contactColumns = ['id', 'firstName', 'lastName', 'email', 'phone', 'actions'];
  contactColumnsFiltered = ['id', 'firstName', 'lastName', 'email', 'phone', 'actions'];
  contactColumnsPrevSel: string[] = [];
  // Table
  @ViewChildren(MatPaginator, {read: true}) paginator!: MatPaginator;
  contactDatasource!: ContactDataSource;

  constructor(private contactService: ContactService, private route: ActivatedRoute, private router: Router, private dialog: MatDialog) {}

  ngOnInit(): void {
    // Load contact list and update tag filter according to route url
    this.contactDatasource = new ContactDataSource(this.activeTagTitle, this.contactService);
    this.route.params.subscribe(params => {
      this.activeTagTitle = params['tag'] || '';
      this.contactDatasource.activeTagTitle = this.activeTagTitle;
      this.contactDatasource.load();
    });
    this.contactDatasource.counter$.subscribe(() => {
      this.contactsLoaded = true;
    });
  }

  updateSearch(): void {
    /*
    // Handle search input
    let needle: string = this.searchValue.toLowerCase();
    this.filteredContacts = [];
    this.contacts.forEach(contact => {
      let fullName = (contact.firstName + ' ' + contact.lastName).toLowerCase();
      // Check name, email, phone and id for a match
      if (fullName.includes(needle) ||
          contact.email.toLowerCase().includes(needle) ||
          contact.phone.toLowerCase().includes(needle) ||
          contact.id?.toString().includes(needle)) {
        this.filteredContacts.push(contact);
      }
    });
    */
  }

  hideColumnsSelectionChange($event: MatSelectChange) {
    // Get currently selected options from navigation state
    let nav = this.router.getCurrentNavigation();
    if (nav && nav.extras && nav.extras.state) {
      this.contactColumnsPrevSel = nav.extras.state['contactColumnsPrevSel'] || this.contactColumnsPrevSel;
    }
    // Handle multi column selection
    this.contactColumnsFiltered = this.contactColumns.filter(col => {
      let isVisible = true;
      // Check if column name matches any of the selected ones
      ($event.value as string[]).every((hiddenCol) => {
        if (col === hiddenCol) { isVisible = false; }
        return isVisible;
      })
      return isVisible;
    });
  }

  updateTable($event: PageEvent) {
    this.contactDatasource.load($event.pageIndex, $event.pageSize);
  }

  editContact(contact: Contact) {
    this.router.navigate(['/contacts/', contact.id], {
      state: { previousUrl: this.router.url }
    });
  }

  deleteContact(contact: Contact) {
    // Open contact deletion confirmation dialog
    this.openDialog<boolean>(AlertDialogComponent, {
      data: { title: 'Warning', text: 'You\'re about to remove contact #' + contact.id + ' permanently. Continue?', showButtonDecline: true },
      width: '400px',
    }, (hasAccepted) => {
      if (hasAccepted) {
        this.contactService.delete(contact).subscribe(() => {
          this.router.navigate(['/all'], {
            state: { contactColumnsPrevSel: this.contactColumnsPrevSel }
          });
        });
      }
    });
  }
  
  private openDialog<D>(component: ComponentType<any>, options: MatDialogConfig, afterClosedFunc?: (value: D) => void) {
    let dialogRef = this.dialog.open(component, options);
    dialogRef.afterClosed().subscribe(afterClosedFunc!);
  }
}
