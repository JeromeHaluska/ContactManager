import { NgModule } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { ContactDetailsComponent } from './contact-details/contact-details.component';
import { ContactListComponent } from './contact-list/contact-list.component';
import { ContactService } from './contact.service';

@NgModule({
  declarations: [
    AppComponent,
    ContactDetailsComponent,
    ContactListComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(
      [
        { path: "all", component: ContactListComponent},
        { path: "contact/:contactId", component: ContactDetailsComponent}
      ]
    )
  ],
  providers: [HttpClient, ContactService],
  bootstrap: [AppComponent]
})
export class AppModule { }
