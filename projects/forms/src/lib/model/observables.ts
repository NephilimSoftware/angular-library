import {combineLatest, from, BehaviorSubject, Observable, OperatorFunction} from 'rxjs';
import {distinctUntilChanged, map, shareReplay, take} from 'rxjs/operators';

export async function read<T>(observable: Observable<T>): Promise<T> {
  return latest(observable).toPromise();
}

export function latest<T>(observable: Observable<T>): Observable<T> {
  return observable.pipe(take(1));
}

export function combineLatestIncludingEmpty<TValue>(items: Observable<TValue>[]): Observable<TValue[]> {
  return items.length > 0 ? combineLatest(items) : new BehaviorSubject([]);
}

export function unify<TValue>(value: Observable<TValue> | Promise<TValue> | TValue): Observable<TValue> {
  if (value instanceof Observable) {
    return value;
  }

  if (value instanceof Promise) {
    return from<Promise<TValue>>(value);
  }

  return new BehaviorSubject(value);
}

export function atLeastOneIsTrue(): OperatorFunction<boolean[], boolean> {
  return (source) =>
    source.pipe(
      map((values) => values.reduce((a, b) => a || b, false)),
      distinctUntilChanged()
    );
}

export function allAreTrue(): OperatorFunction<boolean[], boolean> {
  return (source) =>
    source.pipe(
      map((values) => values.reduce((a, b) => a && b, true)),
      distinctUntilChanged()
    );
}

export function negate(): OperatorFunction<boolean, boolean> {
  return (source) =>
    source.pipe(
      map((value) => !value),
      distinctUntilChanged()
    );
}
