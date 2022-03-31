import { Tag } from "./tag";

export class Contact {
    id?: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    description: string;
    tags: Tag[] = [];

    constructor(firstName: string = '', lastName: string = '', email: string = '', phone: string = '', description: string = '', tags: Tag[] = []) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phone = phone;
        this.description = description;
        this.tags = tags;
    }

    public hasTag(tagTitle: string): boolean {
        return this.tags.some(tag => tag.title === tagTitle);
    }
}
