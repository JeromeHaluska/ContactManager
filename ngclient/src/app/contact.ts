export class Contact {
    id: number = -1;
    firstName: string;
    lastName: string;
    email: string;
    description: string;

    constructor(firstName: string, lastName: string, email: string, description: string) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.description = description;
    }
}
