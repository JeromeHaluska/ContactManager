import { DataSource } from '@angular/cdk/table';
import { Observable, BehaviorSubject, of } from "rxjs";
import { catchError, finalize } from "rxjs/operators";
import { ContactService } from '../contact.service';
import { Contact } from '../contact';
import { RestResponse } from '../rest-response';

export class ContactDataSource implements DataSource<Contact> {
    private contactSubject = new BehaviorSubject<Contact[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    private countSubject = new BehaviorSubject<number>(0);
    public counter$ = this.countSubject.asObservable();
    public loading$ = this.loadingSubject.asObservable();
 
    constructor(public activeTagTitle: string, private contactService: ContactService) { }
 
    connect(): Observable<Contact[]> {
        return this.contactSubject.asObservable();
    }
 
    disconnect(): void {
        this.contactSubject.complete();
        this.loadingSubject.complete();
        this.countSubject.complete();
    }
 
    load(pageNumber = 0, pageSize = 10) {
        this.loadingSubject.next(true);
        this.contactService.findAll(pageNumber, pageSize, this.activeTagTitle).pipe(
            catchError(() => of([])),
            finalize(() => this.loadingSubject.next(false))
        ).subscribe(result => {
            result = (result as RestResponse<Contact>);
            this.contactSubject.next(result.content);
            this.countSubject.next(result.totalElements);
        });
    }
}
