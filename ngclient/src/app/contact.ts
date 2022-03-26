export class Contact {
    id: number = -1;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    description: string;
    tags: string[] = [];

    constructor(firstName: string = '', lastName: string = '', email: string = '', phone: string = '', description: string = '') {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phone = phone;
        this.description = description;
    }
}
