import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { getReadingList, removeFromReadingList, addToReadingList } from '@tmo/books/data-access';
import {MatSnackBar} from '@angular/material/snack-bar';
import { ReadingListItem, Book } from '@tmo/shared/models';

@Component({
  selector: 'tmo-reading-list',
  templateUrl: './reading-list.component.html',
  styleUrls: ['./reading-list.component.scss']
})
export class ReadingListComponent {
  readingList$ = this.store.select(getReadingList);
  removed: Book;
  constructor(private readonly store: Store, private snackBar: MatSnackBar) {}

  removeFromReadingList(item) {
    this.openSnackBar('Undo Remove? ', 'Undo', item)
    this.store.dispatch(removeFromReadingList({ item }));
  }

  openSnackBar(message: string, action: string, item: ReadingListItem) {
    const snackBarRef = this.snackBar.open(message, action, {
      duration: 2000,
    });
    snackBarRef.onAction().subscribe(() => {
      this.store.source.subscribe((e)=>{
        this.removed = e.books.entities[item.bookId];
      })
      setTimeout(()=>{
        this.store.dispatch(addToReadingList({ book: this.removed }));
      },0)
    });
  }
}
