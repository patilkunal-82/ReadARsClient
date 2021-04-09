import { Component, OnInit, Inject, ViewChild, AfterViewInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Feedback, ContactType } from '../shared/feedback';
import { Book, BookLanguage } from '../shared/book';
import { Favorite } from '../shared/favorite';
import { FavoriteService } from '../services/favorite.service';
import { flyInOut, expand } from '../animations/app.animation';
import { FeedbackService } from '../services/feedback.service';
import { BooksService } from '../services/books.service';
import { ReservedService} from '../services/reserved.service';
import { BorrowedService} from '../services/borrowed.service';
import { AvailableService} from '../services/available.service';
import { Location } from '@angular/common';
import { Router, NavigationEnd,ActivatedRoute } from '@angular/router';

import { MatDialog, MatDialogRef } from '@angular/material';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-mybooks',
  templateUrl: './mybooks.component.html',
  styleUrls: ['./mybooks.component.scss'],
  // tslint:disable-next-line:use-host-property-decorator
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
  },
  animations: [
    flyInOut(),
    expand()
  ]
})
export class MybooksComponent implements OnInit, AfterViewInit {

  favorites: Favorite;
  delete: boolean;
  errMess: string;
  currentRouter = this.router.url;
  @ViewChild('fform') bookDetailsFormDirective;
  bookDetailsForm: FormGroup;
  book: Book;
  addbook: Book;
  removebook: Book;
  books: Book[];

  booklanguage = BookLanguage;
  //feedback: Feedback;
  contactType = ContactType;
  submitted = null;
  showForm = true;

  borrowed: boolean;
  reserved: boolean;
  available: boolean;
  panelOpenState = false;

  displayedColumns: string[] = ['bookname', 'booklanguage', 'bookdescription', 'status'];
  dataSource = new MatTableDataSource<Book>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  formErrors = {
    'bookname': '',
    'booklanguage': '',
    'bookowneraddress':'',
    'bookdescription':'',
    'bookownertelnum':'',
    'bookrating':''
  };

  validationMessages = {
    'bookname': {
      'required':      'Book Name is required.',
      'minlength':     'Book Name must be at least 1 character long.',
      'maxlength':     'BookName cannot be more than 40 characters long.'
    },
    'booklanguage': {
      'required':      'Book Language is required.',
      'minlength':     'Book Language must be at least 2 characters long.',
      'maxlength':     'Book Language cannot be more than 25 characters long.'
    },
    'bookowneraddress': {
      'required':      'Address is required.',
    },
    'bookownertelnum': {
      'required':      'Contact number is required.',
      'pattern':       'Contact number must contain only numbers.'
    }
  };

  constructor(private favoriteService: FavoriteService,
    @Inject('baseURL') private baseURL, private fb: FormBuilder,
      private feedbackservice: FeedbackService, private booksservice: BooksService,
      public dialog: MatDialog,
      private reservedService: ReservedService,private borrowedService: BorrowedService, private availableService: AvailableService,
      private location: Location, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.createForm();

    this.booksservice.getBooks()
      .subscribe(books => {
          this.books = books;
          this.dataSource.data = this.books;
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
      }, errmess => this.errMess = <any>errmess);
  }

  ngAfterViewInit() {
   this.dataSource.paginator = this.paginator;
   this.dataSource.sort = this.sort;
 }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    console.log("filter value", filterValue);

    this.dataSource.filter = filterValue.trim().toLowerCase();


    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  deleteBook(id: string) {
    console.log('Deleting Book ' + id);

    this.booksservice.deleteBook(id)
    .subscribe(removebook => this.removebook = <Book>removebook,
      errmess => this.errMess = <any>errmess);
      this.delete = false;

      this.ngOnInit();
  }

  lendBook(id: string) {
    console.log('Lending Book ' + id);
    this.booksservice.getBook(id)
    .subscribe(book => {
      this.router.navigate([this.currentRouter]);
      this.book = book;
      this.book.bookavailable = false;
      this.book.bookreserved = true;
      this.book.bookborrowed = true;
      this.booksservice.lendBook(id, this.book)
      .subscribe(book => {console.log(book); this.borrowed = true; this.reserved = true;});
    },  errmess => this.errMess = <any>errmess);
  }

  releaseBook(id: string) {
    console.log('Releasing Book ' + id);

    this.booksservice.getBook(id)
    .subscribe(book => {
      this.router.navigate([this.currentRouter]);
      this.book = book;
      this.book.bookavailable = true;
      this.book.bookreserved = false;
      this.book.bookborrowed = false;
      this.booksservice.releaseBook(this.book._id, this.book)
      .subscribe(book => {console.log(book); this.available = true; this.reserved = false;});
    },  errmess => this.errMess = <any>errmess);

  }


  createForm() {
        this.bookDetailsForm = this.fb.group({
          bookname: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(40)] ],
          booklanguage: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
          bookowneraddress: ['', [Validators.required]],
          bookdescription: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)] ],
          bookownertelnum:['', [Validators.required, Validators.pattern] ],
          bookrating: '5'
        });
        this.bookDetailsForm.valueChanges
        .subscribe(data => this.onValueChanged(data));

        this.onValueChanged(); // (re)set validation messages now
      }

      onValueChanged(data?: any) {
        if (!this.bookDetailsForm) { return; }
        const form = this.bookDetailsForm;
        for (const field in this.formErrors) {
          if (this.formErrors.hasOwnProperty(field)) {
            // clear previous error message (if any)
            this.formErrors[field] = '';
            const control = form.get(field);
            if (control && control.dirty && !control.valid) {
              const messages = this.validationMessages[field];
              for (const key in control.errors) {
                if (control.errors.hasOwnProperty(key)) {
                  this.formErrors[field] += messages[key] + ' ';
                }
              }
            }
          }
        }
      }

      onSubmit() {
        this.addbook = this.bookDetailsForm.value;
      //  this.feedback = this.bookDetailsForm.value;
        //console.log(this.addbook);
        this.showForm = false;

        this.booksservice.addBook(this.addbook)
        .subscribe(addbook => {
          console.log("response received");
          this.submitted = addbook;
          console.log(this.submitted);
          this.addbook = null;
          setTimeout(() => { this.submitted = null; this.showForm = true; }, 5000);
        },
        error => console.log(error.status, error.message));

        this.bookDetailsForm.reset({
          bookname: '',
          booklanguage: '',
          bookowneraddress: '',
          bookdescription:'',
          bookownertelnum:'',
          bookrating: '5'
        });
        this.bookDetailsFormDirective.resetForm();

        this.ngOnInit();
      }




}
