import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Contact } from './contact';
import { Observable } from 'rxjs';

@Injectable()
export class ContactService {
  private restUrl = 'http://localhost:8080/';

  constructor(private http: HttpClient) { }

  public findAll(): Observable<Contact[]> {
    return this.http.get<Contact[]>(this.restUrl + 'all');
  }

  public save(contact: Contact) {
    return this.http.post<Contact>(this.restUrl + 'add', contact);
  }
}
