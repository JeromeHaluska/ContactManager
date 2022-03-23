import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Contact } from './contact';
import { forkJoin, Observable, ReplaySubject } from 'rxjs';

@Injectable()
export class ContactService {
  private apiUrl = 'http://localhost:8080/contacts/';
  private contactsSubject = new ReplaySubject<Contact[]>(1);
  private contacts$: Observable<Contact[]>;

  constructor(private http: HttpClient) {
    this.contacts$ = this.contactsSubject.asObservable();
    this.fetchAll();
  }

  // Request list of all contacts from api
  private fetchAll(): Observable<Contact[]> {
    this.http.get<Contact[]>(this.apiUrl + 'all').subscribe({
      next: contacts => {
        this.contactsSubject.next(contacts);
      },
      error: error => {
        this.contactsSubject.error(error);
        console.error('An error occurred while fetching contact list!', error);
      }
    });
    return this.findAll();
  }

  public findAll(): Observable<Contact[]> {
    return this.contacts$;
  }

  public findById(id: Number): Observable<Contact> {
    return this.http.get<Contact>(this.apiUrl + id);
  }

  public update(contact: Contact): Observable<Contact> {
    return this.http.put<Contact>(this.apiUrl + contact.id, contact);
  }

  public add(contact: Contact): Observable<Contact> {
    let addAndFetch$ = new Observable<Contact>(subscriber => {
      this.http.post<Contact>(this.apiUrl + 'add', contact).subscribe(data => {
        this.fetchAll().subscribe(() => {
          subscriber.next(data);
          subscriber.complete();
        });
      })
    });
    return addAndFetch$;
  }

  public addList(contacts: Contact[]): Observable<Contact[]> {
    // Prepare deletion of multiple contacts
    let streams$: Observable<Contact>[] = [];
    contacts.forEach((contact: Contact) => streams$.push(this.http.post<Contact>(this.apiUrl + 'add', contact)));
    // Create combined observer for deletion
    let addAndFetch$ = new Observable<Contact[]>(subscriber => {
      if (contacts.length === 0) {
        subscriber.next();
        subscriber.complete();
      }
      forkJoin(streams$).subscribe(data => {
        this.fetchAll().subscribe(() => {
          subscriber.next(data);
          subscriber.complete();
        });
      });
    });
    return addAndFetch$;
  }

  public delete(contact: Contact): Observable<Contact> {
    let deleteAndFetch$ = new Observable<Contact>(subscriber => {
      this.http.delete<Contact>(this.apiUrl + contact.id).subscribe(data => {
        this.fetchAll().subscribe(() => {
          subscriber.next(data);
          subscriber.complete();
        });
      })
    });
    return deleteAndFetch$;
  }

  public deleteList(contacts: Contact[]): Observable<Contact[]> {
    // Prepare deletion of multiple contacts
    let streams$: Observable<Contact>[] = [];
    contacts.forEach((contact: Contact) => streams$.push(this.http.delete<Contact>(this.apiUrl + contact.id)));
    // Create combined observer for deletion
    let deleteAndFetch$ = new Observable<Contact[]>(subscriber => {
      if (contacts.length === 0) {
        subscriber.next();
        subscriber.complete();
      }
      forkJoin(streams$).subscribe(data => {
        this.fetchAll().subscribe(() => {
          subscriber.next(data);
          subscriber.complete();
        });
      });
    });
    return deleteAndFetch$;
  }
}
