import { Component, OnInit, ViewChild, Inject, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { visibility, flyInOut, expand } from '../animations/app.animation';
import { Dish } from '../shared/dish';
import { Book } from '../shared/book';
import { Comment } from '../shared/comment';
import { DishService } from '../services/dish.service';
import { ReadarsService } from '../services/readars.service';
import { FavoriteService } from '../services/favorite.service';
import { ReservedService } from '../services/reserved.service';

import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import {VERSION} from '@angular/material';
import { ScrollDispatchModule } from '@angular/cdk/scrolling';

import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-bookdetail',
  templateUrl: './bookdetail.component.html',
  styleUrls: ['./bookdetail.component.scss'],
//  changeDetection: ChangeDetectionStrategy.OnPush,
  // tslint:disable-next-line:use-host-property-decorator
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
  },
  animations: [
    visibility(),
    flyInOut(),
    expand()
  ]
})
export class BookdetailComponent implements OnInit {

  @ViewChild('cform') commentFormDirective;
  dish: Dish;
  book: Book;
  clientBook: Book;
  books: Book[];

  dishcopy: Dish;
  bookcopy: Book;

  dishIds: string[];
  bookIds: string[];
  lbookIds: string[];

  prev: string;
  next: string;

  comment: Comment;

  errMess: string;

  visibility = 'shown';
  favorite = false;
  reserved = false;

  version = VERSION;
  panelOpenState = false;

  formErrors = {
    'comment': ''
  };

  validationMessages = {
    'comment': {
      'required': 'Comment is required.'
    }
  };

  commentForm: FormGroup;

  constructor(private dishservice: DishService,
    private favoriteService: FavoriteService,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder,
    private readarsService: ReadarsService,
    private reservedService: ReservedService,
    @Inject('baseURL') private baseURL) {

    }

  ngOnInit() {
    this.createForm();

    /*this.dishservice.getDishIds().subscribe(dishIds => this.dishIds = dishIds);
    this.route.params.pipe(switchMap((params: Params) => { this.visibility = 'hidden';
    return this.dishservice.getDish(params['id']); }))
    .subscribe(dish => {
      this.dish = dish;
      this.setPrevNext(dish._id);
      this.visibility = 'shown';
      this.favoriteService.isFavorite(this.dish._id)
      .subscribe(resp => { console.log(resp); this.favorite = <boolean>resp.exists; },
          err => console.log(err));
    },
    errmess => this.errMess = <any>errmess);*/

    /*


    */

   this.readarsService.getBookIds().subscribe(bookIds => {
     this.bookIds = bookIds;
     this.storeBookIds(this.bookIds);
   }, errmess => this.errMess = <any>errmess);
   this.lbookIds = this.loadBookIds();
   console.log("BookIds from getBookIds" + this.bookIds);
   console.log("BookIds from getBookIds" + this.bookIds);
    this.route.params.pipe(switchMap((params: Params) => {
      this.visibility = 'hidden';
      return this.readarsService.getBook(params['id']); }))
    .subscribe(book => {
      this.book = book;
      console.log("Book found for id:"+ this.book._id);
      this.setPrevNext(this.book._id);
      this.visibility = 'shown';
      /*this.favoriteService.isFavorite(this.dish._id)
      .subscribe(resp => { console.log(resp); this.favorite = <boolean>resp.exists; },
          err => console.log(err));*/
      this.reservedService.isReserved(this.book._id)
      .subscribe(resp => { console.log(resp); this.reserved = <boolean>resp.exists; },
          err => console.log(err));
    },
    errmess => this.errMess = <any>errmess);
  }

  setPrevNext(bookId: string) {

    console.log("Into setPreNext");

    this.lbookIds = this.loadBookIds();

    console.log("BookIds array" + this.lbookIds);
    console.log("BookIds array length" + this.lbookIds.length);
    console.log("Specifc BookId:" + bookId);
    //const index = this.bookIds.indexOf(bookId);
    const index = this.lbookIds.indexOf(bookId);


    console.log("Specific BookId after try catch" + bookId);
    //const index = this.bookIds.indexOf(bookId);
  /*  console.log("Array index" + index);
    this.prev = this.bookIds[(this.bookIds.length + index -1) % this.bookIds.length];
    this.next = this.bookIds[(this.bookIds.length + index +1 ) % this.bookIds.length];*/

    console.log("Array index" + index);
      this.prev = this.lbookIds[(this.lbookIds.length + index -1) % this.lbookIds.length];
      this.next = this.lbookIds[(this.lbookIds.length + index +1 ) % this.lbookIds.length];

  }

  goBack(): void {
    this.location.back();
  }

  createForm() {
    this.commentForm = this.fb.group({
      rating: '5',
      comment: ['', Validators.required]
    });

    this.commentForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); // (re)set validation messages now
  }

  onSubmit() {
    /*this.dishservice.postComment(this.dish._id, this.commentForm.value)
      .subscribe(dish => this.dish = <Dish>dish);
    this.commentFormDirective.resetForm();
    this.commentForm.reset({
      rating: 5,
      comment: ''
    });*/
    this.readarsService.postComment(this.book._id, this.commentForm.value)
      .subscribe(book => this.book = <Book>book);
    this.commentFormDirective.resetForm();
    this.commentForm.reset({
      rating: '5',
      comment: ''
    });
  }

  onValueChanged(data?: any) {
    if (!this.commentForm) { return; }
    const form = this.commentForm;
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

  addToFavorites() {
    if (!this.favorite) {
      this.favoriteService.postFavorite(this.dish._id)
        .subscribe(favorites => { console.log(favorites); this.favorite = true; });
    }
  }

  reserveBook() {
    console.log("inside reserveBook of BookdetailComponent.ts");
    alert("Contact & collect the book from the owner in next 48 hours. Failing which, the book will be made available to others !");
    this.book.bookavailable = false;
    this.book.bookreserved = true;
    this.book.bookborrowed = false;
    this.readarsService.reserveBook(this.book._id, this.book)
      .subscribe(book => { console.log(book); this.reserved = true;});
  //  this.goBack();
  }

  storeBookIds(bookIds: any[]) {
    console.log('BookIds stored are :', bookIds);
    localStorage.setItem('bookIds', JSON.stringify(bookIds));
  }

  loadBookIds() {
    this.bookIds = JSON.parse(localStorage.getItem('bookIds'));
    console.log('bookIds ', this.bookIds);
    if (this.bookIds) {
      return this.bookIds;
    }
    return;
  }


}
