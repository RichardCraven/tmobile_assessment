import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { getReadingList, removeFromReadingList, updateReadingList } from '@tmo/books/data-access';

@Component({
  selector: 'tmo-reading-list',
  templateUrl: './reading-list.component.html',
  styleUrls: ['./reading-list.component.scss']
})
export class ReadingListComponent {
  readingList$ = this.store.select(getReadingList);
  hoveredIndex: number;
  constructor(private readonly store: Store) {}
  removeFromReadingList(item) {
    this.store.dispatch(removeFromReadingList({ item }));
  }
  finishedBook(item){
    this.store.dispatch(updateReadingList({item}))
    setTimeout(()=>{
      this.readingList$ = this.store.select(getReadingList);
    })
  }
  convertToDate(isoDate){
    const date = new Date(isoDate),
    year = date.getFullYear(),
    month = date.getMonth()+1,
    day = date.getDate();
    return month + '/' + day + '/' + year
  }
}
