import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Contact } from './contact';
import { Observable } from 'rxjs';

@Injectable()
export class ContactService {
  private apiUrl = 'http://localhost:8080/contacts/';

  constructor(private http: HttpClient) { }

  public findAll(): Observable<Contact[]> {
    return this.http.get<Contact[]>(this.apiUrl + 'all');
  }

  public findById(id: Number): Observable<Contact> {
    return this.http.get<Contact>(this.apiUrl + id);
  }

  public update(contact: Contact): Observable<Object> {
    return this.http.put<Contact>(this.apiUrl + contact.id, contact);
  }

  public add(contact: Contact): Observable<Contact> {
    return this.http.post<Contact>(this.apiUrl + 'add', contact);
  }

  public delete(contact: Contact): Observable<Object> {
    return this.http.delete(this.apiUrl + contact.id);
  }
}
