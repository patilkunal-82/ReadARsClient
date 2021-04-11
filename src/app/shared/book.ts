import { User } from './user';

export class Book {
    _id: string;
    bookname: string;
    booklanguage: string;
    bookdescription: string;
    bookowner: User;
    bookauthor: string;
    bookowneraddress: string;
    bookownertelnum: string;
    bookrating: string;
    bookavailable: boolean;
    bookreserved: boolean;
    bookborrowed: boolean;
}

export const BookLanguage = ['English', 'Hindi', 'Marathi', 'German', 'Tamil',
                             'Spanish', 'French', 'Telugu', 'Latin', 'Malyalam'];
