import {Observable} from 'rxjs';
import {take} from 'rxjs/operators';

export function warmUp<TValue>(observable: Observable<TValue>): Observable<TValue> {
  observable.pipe(take(1)).subscribe();
  return observable;
}
