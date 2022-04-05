import { NgModule } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';

import { AppComponent } from './app.component';
import { ContactDetailsComponent } from './contact-details/contact-details.component';
import { ContactListComponent } from './contact-list/contact-list.component';
import { ContactService } from './contact.service';
import { ContactAddComponent } from './contact-add/contact-add.component';
import { TagService } from './tag.service';
import { AlertDialogComponent } from './dialogs/alert-dialog/alert-dialog.component';
import { ResetDialogComponent } from './dialogs/reset-dialog/reset-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    ContactDetailsComponent,
    ContactListComponent,
    ContactAddComponent,
    AlertDialogComponent,
    ResetDialogComponent
  ],
  imports: [
    // Angular modules
    RouterModule.forRoot(
      [
        { path: "all", component: ContactListComponent},
        { path: "all/:tag", component: ContactListComponent},
        { path: "add", component: ContactAddComponent},
        { path: "contacts/:id/edit", component: ContactAddComponent},
        { path: "contacts/:id", component: ContactDetailsComponent}
      ], {
        onSameUrlNavigation: 'reload'
      }
    ),
    BrowserModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    // Material modules
    MatPaginatorModule,
    MatTableModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatCardModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    MatFormFieldModule,
  ],
  providers: [HttpClient, ContactService, TagService],
  bootstrap: [AppComponent]
})
export class AppModule { }
