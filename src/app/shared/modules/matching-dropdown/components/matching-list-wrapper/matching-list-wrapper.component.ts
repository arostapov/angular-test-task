import { ChangeDetectionStrategy, Component, EventEmitter, inject, Output } from '@angular/core';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { Observable, of } from 'rxjs';

import { MATCHING_DATA, SEARCH_TERM } from '../../constants';
import { ArrayFilterPipe } from '../../../../pipes';

@Component({
  selector: 'app-matching-list-wrapper',
  standalone: true,
  imports: [NgForOf, ArrayFilterPipe, AsyncPipe, NgIf],
  templateUrl: './matching-list-wrapper.component.html',
  styleUrl: './matching-list-wrapper.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MatchingListWrapperComponent {
  dataset: string[] | null = inject<string[]>(MATCHING_DATA, { optional: true }) ?? [];
  searchTerm$: Observable<string> =
    inject<Observable<string> | null>(SEARCH_TERM, { optional: true }) ?? of('');

  @Output() selectEvent = new EventEmitter();

  get selectedItem$(): Observable<string> {
    return this.selectEvent.asObservable();
  }

  select(item: string) {
    this.selectEvent.emit(item);
  }

  trackBy(index: number, item: string) {
    return item;
  }
}
