import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Tag } from './tag';
import { forkJoin, Observable, ReplaySubject, Subscriber } from 'rxjs';

@Injectable()
export class TagService {
  private apiUrl = 'http://localhost:8080/tags/';
  private tagsSubject = new ReplaySubject<Tag[]>(1);
  private tags$: Observable<Tag[]>;

  constructor(private http: HttpClient) {
    this.tags$ = this.tagsSubject.asObservable();
    this.fetchAll();
  }

  private fetchAndPassResponseThrough(subscriber: Subscriber<any>, stream$: Observable<any>): void {
    stream$.subscribe({
      next: data => {
        this.fetchAll().subscribe(() => {
          subscriber.next(data);
          subscriber.complete();
        });
      },
      error: error => {
        subscriber.error(error);
      }
    });
  }

  // Request list of all tags from api
  public fetchAll(): Observable<Tag[]> {
    this.http.get<Tag[]>(this.apiUrl).subscribe({
      next: tags => {
        this.tagsSubject.next(tags);
      },
      error: error => {
        this.tagsSubject.error(error);
        console.error('An error occurred while fetching tag list!', error);
      }
    });
    return this.findAll();
  }

  public findAll(): Observable<Tag[]> {
    return this.tags$;
  }

  public findById(id: Number): Observable<Tag> {
    return this.http.get<Tag>(this.apiUrl + id);
  }

  public update(tag: Tag): Observable<Tag> {
    let updateAndFetch$ = new Observable<Tag>(subscriber => {
      this.fetchAndPassResponseThrough(subscriber, this.http.put<Tag>(this.apiUrl + tag.id, tag));
    });
    return updateAndFetch$;
  }

  public add(tag: Tag): Observable<Tag> {
    let addAndFetch$ = new Observable<Tag>(subscriber => {
      this.fetchAndPassResponseThrough(subscriber, this.http.post<Tag>(this.apiUrl, tag));
    });
    return addAndFetch$;
  }

  public addList(tags: Tag[]): Observable<Tag[]> {
    // Prepare creation of multiple tags
    let streams$: Observable<Tag>[] = [];
    tags.forEach((tagsSubject: Tag) => streams$.push(this.http.post<Tag>(this.apiUrl, tagsSubject)));
    // Create combined observer for creation
    let addAndFetch$ = new Observable<Tag[]>(subscriber => {
      if (tags.length === 0) {
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

  public delete(tag: Tag): Observable<Tag> {
    let deleteAndFetch$ = new Observable<Tag>(subscriber => {
      this.fetchAndPassResponseThrough(subscriber, this.http.delete<Tag>(this.apiUrl + tag.id));
    });
    return deleteAndFetch$;
  }

  public deleteAll(): Observable<HttpResponse<Tag>> {
    let deleteAndFetch$ = new Observable<HttpResponse<Tag>>(subscriber => {
      this.fetchAndPassResponseThrough(subscriber, this.http.delete<HttpResponse<Tag>>(this.apiUrl));
    });
    return deleteAndFetch$;
  }
}