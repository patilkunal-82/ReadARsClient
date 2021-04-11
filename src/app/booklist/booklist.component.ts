import { Component, OnInit, Inject, AfterViewInit, ViewChild } from '@angular/core';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { Book } from '../shared/book';
import { BooksService } from '../services/books.service';
import { ReadarsService } from '../services/readars.service';
import { flyInOut, expand } from '../animations/app.animation';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { CarouselComponent } from '../carousel/carousel.component';
import { CarouselItemDirective } from '../carousel/carousel-item.directive';
import { CarouselItemElementDirective } from '../carousel/carousel-item-element.directive';

@Component({
  selector: 'app-booklist',
  templateUrl: './booklist.component.html',
  styleUrls: ['./booklist.component.scss'],
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
export class BooklistComponent implements OnInit, AfterViewInit {

  books: Book[];
  dishes: Dish[];
  errMess: string;
  showForm = true;
  selectedDish: Dish;
  searchText: string;

//  displayedColumns: string[] = ['id', 'name', 'progress', 'color'];
  displayedColumns: string[] = ['bookname', 'booklanguage', 'bookauthor','bookdescription','status'];
  dataSource = new MatTableDataSource<Book>();



  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private dishService: DishService, private booksService: BooksService,
    private readarsService: ReadarsService, @Inject('baseURL') private baseURL) {

   }

  ngOnInit() {
    this.showForm = false;
    this.dishService.getDishes()
      .subscribe(dishes => this.dishes = dishes,
        errmess => this.errMess = <any>errmess);
    /*this.booksService.getBooks()
      .subscribe(books => this.books = books,
        errmess => this.errMess = <any>errmess);*/
      this.readarsService.getBooks()
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

  onSelect(dish: Dish) {
    this.selectedDish = dish;
  }

}
