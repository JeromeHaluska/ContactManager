import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Contact } from './contact';
import { combineLatest, Observable, Subscriber } from 'rxjs';
import { TagService } from './tag.service';
import { RestResponse } from './rest-response';
import { environment } from '../environments/environment';

@Injectable()
export class ContactService {
  private resourceUrl = 'contacts';

  constructor(private http: HttpClient, private tagService: TagService) {}

  public findAll(page = 0, size = 10, tagTitle = ''): Observable<RestResponse<Contact>> {
    const endpoint = environment.apiBaseUrl + this.resourceUrl;
    let params = { page, size, tag: tagTitle };
    return this.http.get<RestResponse<Contact>>(endpoint, { params });
  }

  public findById(id: Number): Observable<Contact> {
    const endpoint = environment.apiBaseUrl + this.resourceUrl + '/' + id;
    return this.http.get<Contact>(endpoint);
  }

  public update(contact: Contact): Observable<HttpResponse<void>> {
    const endpoint = environment.apiBaseUrl + this.resourceUrl + '/' + contact.id;
    let updateAndFetch$ = new Observable<HttpResponse<void>>(subscriber => {
      this.fetchAndPassResponseThrough(subscriber, this.http.put<HttpResponse<void>>(endpoint, contact));
    });
    return updateAndFetch$;
  }

  public add(contact: Contact): Observable<HttpResponse<void>> {
    const endpoint = environment.apiBaseUrl + this.resourceUrl;
    let addAndFetch$ = new Observable<HttpResponse<void>>(subscriber => {
      this.fetchAndPassResponseThrough(subscriber, this.http.post<HttpResponse<void>>(endpoint, contact));
    });
    return addAndFetch$;
  }

  public addList(contacts: Contact[]): Observable<HttpResponse<void>> {
    const endpoint = environment.apiBaseUrl + this.resourceUrl;
    // Prepare creation of multiple contacts
    let streams$: Observable<HttpResponse<void>>[] = [];
    contacts.forEach((contact: Contact) => streams$.push(this.http.post<HttpResponse<void>>(endpoint, contact)));
    // Create combined observer for creation
    let addAndFetch$ = new Observable<HttpResponse<void>>(subscriber => {
      if (contacts.length === 0) {
        subscriber.next();
        subscriber.complete();
      }
      this.fetchAndPassResponseThrough(subscriber, combineLatest(streams$));
    });
    return addAndFetch$;
  }

  public delete(contact: Contact): Observable<HttpResponse<void>> {
    const endpoint = environment.apiBaseUrl + this.resourceUrl + '/' + contact.id;
    let deleteAndFetch$ = new Observable<HttpResponse<void>>(subscriber => {
      this.fetchAndPassResponseThrough(subscriber, this.http.delete<HttpResponse<void>>(endpoint));
    });
    return deleteAndFetch$;
  }

  public deleteAll(): Observable<HttpResponse<void>> {
    const endpoint = environment.apiBaseUrl + this.resourceUrl;
    let deleteAndFetch$ = new Observable<HttpResponse<void>>(subscriber => {
      this.fetchAndPassResponseThrough(subscriber, this.http.delete<HttpResponse<void>>(endpoint));
    });
    return deleteAndFetch$;
  }

  private fetchAndPassResponseThrough(subscriber: Subscriber<any>, stream$: Observable<any>): void {
    stream$.subscribe({
      next: data => {
        this.tagService.fetchAll().subscribe(() => {
          subscriber.next(data);
          subscriber.complete();
        });
      },
      error: error => {
        subscriber.error(error);
      }
    });
  }
}