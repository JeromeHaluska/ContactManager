import { ComponentType } from '@angular/cdk/portal';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { filter, Observable } from 'rxjs';
import { Contact } from '../contact';
import { ContactService } from '../contact.service';
import { AlertDialogComponent } from '../dialogs/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-contact-details',
  templateUrl: './contact-details.component.html',
  styleUrls: ['./contact-details.component.css']
})
export class ContactDetailsComponent implements OnInit {
  errorMessage: string = '';
  contact!: Contact;
  previousUrl = '/all';

  constructor(private contactService: ContactService, private route: ActivatedRoute, private router: Router, private dialog: MatDialog) {
    let nav = this.router.getCurrentNavigation();
    if (nav && nav.extras && nav.extras.state) {
      this.previousUrl = nav.extras.state['previousUrl'] || this.previousUrl;
    }
  }

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
    this.router.navigate(['contacts', contact.id, 'edit']);
  }

  deleteContact(contact: Contact) {
    // Open contact deletion confirmation dialog
    this.openDialog<boolean>(AlertDialogComponent, {
      data: { title: 'Warning', text: 'You\'re about to remove contact #' + contact.id + ' permanently. Continue?', showButtonDecline: true },
      width: '400px',
    }, (hasAccepted) => {
      if (hasAccepted) {
        this.contactService.delete(contact).subscribe(() => {
          this.router.navigate([this.previousUrl]);
        });
      }
    });
  }

  redirectBack() {
    this.router.navigate([this.previousUrl]);
  }
  
  private openDialog<D>(component: ComponentType<any>, options: MatDialogConfig, afterClosedFunc?: (value: D) => void) {
    let dialogRef = this.dialog.open(component, options);
    dialogRef.afterClosed().subscribe(afterClosedFunc!);
  }
}
