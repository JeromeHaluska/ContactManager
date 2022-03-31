import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Contact } from './contact';
import { combineLatest, forkJoin, Observable, ReplaySubject, Subscriber } from 'rxjs';
import { TagService } from './tag.service';

@Injectable()
export class ContactService {
  private apiUrl = 'http://localhost:8080/contacts/';
  private contactsSubject = new ReplaySubject<Contact[]>(1);
  private contacts$: Observable<Contact[]>;

  constructor(private http: HttpClient, private tagService: TagService) {
    this.contacts$ = this.contactsSubject.asObservable();
    this.fetchAll();
  }

  // Request list of all contacts from api
  private fetchAll(): Observable<Contact[]> {
    this.http.get<Contact[]>(this.apiUrl).subscribe({
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

  private fetchAndPassResponseThrough(subscriber: Subscriber<any>, stream$: Observable<any>) {
    stream$.subscribe({
      next: data => {
        console.log('Fetch data recieved', data);
        combineLatest([this.tagService.fetchAll(), this.fetchAll()]).subscribe(() => {
          console.log('Refreshed contacts and tag records');
          subscriber.next(data);
          subscriber.complete();
        });
      },
      error: error => {
        subscriber.error(error);
      }
    });
  }

  public findAll(): Observable<Contact[]> {
    return this.contacts$;
  }

  public findById(id: Number): Observable<Contact> {
    return this.http.get<Contact>(this.apiUrl + id);
  }

  public update(contact: Contact): Observable<Contact> {
    let updateAndFetch$ = new Observable<Contact>(subscriber => {
      this.fetchAndPassResponseThrough(subscriber, this.http.put<Contact>(this.apiUrl + contact.id, contact));
    });
    return updateAndFetch$;
  }

  public add(contact: Contact): Observable<Contact> {
    let addAndFetch$ = new Observable<Contact>(subscriber => {
      this.fetchAndPassResponseThrough(subscriber, this.http.post<Contact>(this.apiUrl, contact));
    });
    return addAndFetch$;
  }

  public addList(contacts: Contact[]): Observable<Contact[]> {
    // Prepare creation of multiple contacts
    let streams$: Observable<Contact>[] = [];
    contacts.forEach((contact: Contact) => streams$.push(this.http.post<Contact>(this.apiUrl, contact)));
    // Create combined observer for creation
    let addAndFetch$ = new Observable<Contact[]>(subscriber => {
      if (contacts.length === 0) {
        subscriber.next();
        subscriber.complete();
      }
      this.fetchAndPassResponseThrough(subscriber, forkJoin(streams$));
      /*forkJoin(streams$).subscribe(data => {
        this.fetchAll().subscribe(() => {
          subscriber.next(data);
          subscriber.complete();
        });
      });*/
    });
    return addAndFetch$;
  }

  public delete(contact: Contact): Observable<Contact> {
    let deleteAndFetch$ = new Observable<Contact>(subscriber => {
      this.fetchAndPassResponseThrough(subscriber, this.http.delete<Contact>(this.apiUrl + contact.id));
    });
    return deleteAndFetch$;
  }

  public deleteAll(): Observable<HttpResponse<Contact>> {
    let deleteAndFetch$ = new Observable<HttpResponse<Contact>>(subscriber => {
      this.fetchAndPassResponseThrough(subscriber, this.http.delete<HttpResponse<Contact>>(this.apiUrl));
    });
    return deleteAndFetch$;
  }
}