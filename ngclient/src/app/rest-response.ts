export interface Sort {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
}

export interface Pageable {
    offset: number;
    pageNumber: number;
    pageSize: number;
    paged: boolean;
    sort: Sort;
    unpaged: boolean;
}

export class RestResponse<Type> {
    constructor(public content: Type[], public empty: boolean, public first: boolean, public last: boolean,
        public number: number, public numberOfElements: number, public pageable: Pageable, public size: number,
        public sort: Sort, public totalElements: number, public totalPages: number) { }
}