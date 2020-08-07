import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import {MatSnackBar} from '@angular/material/snack-bar';
import {
  addToReadingList,
  removeFromReadingList,
  clearSearch,
  getAllBooks,
  ReadingListBook,
  searchBooks
} from '@tmo/books/data-access';
import { FormBuilder } from '@angular/forms';
import { Book, ReadingListItem } from '@tmo/shared/models';

@Component({
  selector: 'tmo-book-search',
  templateUrl: './book-search.component.html',
  styleUrls: ['./book-search.component.scss']
})
export class BookSearchComponent implements OnInit {
  books: ReadingListBook[];
  toRemove: ReadingListItem;
  searchForm = this.fb.group({
    term: ''
  });

  constructor(
    private readonly store: Store,
    private readonly fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {}

  get searchTerm(): string {
    return this.searchForm.value.term;
  }

  ngOnInit(): void {
    this.store.select(getAllBooks).subscribe(books => {
      this.books = books;
    });
  }

  formatDate(date: void | string) {
    return date
      ? new Intl.DateTimeFormat('en-US').format(new Date(date))
      : undefined;
  }

  addBookToReadingList(book: Book) {
    this.openSnackBar_undoAdd('Undo Add? ', 'Undo', book)
    this.store.dispatch(addToReadingList({ book }));
  }

  searchExample() {
    this.searchForm.controls.term.setValue('javascript');
    this.searchBooks();
  }

  searchBooks() {
    if (this.searchForm.value.term) {
      this.store.dispatch(searchBooks({ term: this.searchTerm }));
    } else {
      this.store.dispatch(clearSearch());
    }
  }

  openSnackBar_undoAdd(message: string, action: string, book: Book) {
    const snackBarRef = this.snackBar.open(message, action, {
      duration: 2000,
    });

    snackBarRef.onAction().subscribe(() => {
      this.store.source.subscribe((e)=>{
        this.toRemove = e.readingList.entities[book.id];
      })
      setTimeout(()=>{
        this.removeFromReadingList()
      },0)
    });
  }
  removeFromReadingList(){
    this.store.dispatch(removeFromReadingList({item: this.toRemove}))
  }
}
