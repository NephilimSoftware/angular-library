import {BehaviorSubject, combineLatest, Observable} from 'rxjs';

export function combineLatestIncludingEmpty<TValue>(items: Observable<TValue>[]): Observable<TValue[]> {
  return items.length > 0 ? combineLatest(items) : new BehaviorSubject([]);
}
