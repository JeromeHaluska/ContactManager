import { NgModule } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { ContactDetailsComponent } from './contact-details/contact-details.component';
import { ContactListComponent } from './contact-list/contact-list.component';
import { ContactService } from './contact.service';
import { ContactAddComponent } from './contact-add/contact-add.component';

@NgModule({
  declarations: [
    AppComponent,
    ContactDetailsComponent,
    ContactListComponent,
    ContactAddComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(
      [
        { path: "all", component: ContactListComponent},
        { path: "add", component: ContactAddComponent},
        { path: "contacts/:id/edit", component: ContactAddComponent},
        { path: "contacts/:id", component: ContactDetailsComponent}
      ], {
        onSameUrlNavigation: 'reload'
      }
    )
  ],
  providers: [HttpClient, ContactService],
  bootstrap: [AppComponent]
})
export class AppModule { }
