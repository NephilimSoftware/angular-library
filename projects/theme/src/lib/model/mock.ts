import {AsyncSubject, Observable} from 'rxjs';
import {delay, map} from 'rxjs/operators';

export function mock<TValue>(value: TValue, delayTime: number = 1000): Observable<TValue> {
  const result: AsyncSubject<TValue> = new AsyncSubject<TValue>();
  result.next(value);
  result.complete();

  return result.pipe(delay(delayTime));
}

export function mockError<TError, TResult>(error: TError, delayTime: number = 1000): Observable<TResult> {
  const result: AsyncSubject<TResult> = new AsyncSubject<TResult>();
  result.next(null as never);
  result.complete();

  return result.pipe(
    delay(delayTime),
    map(() => {
      throw error;
    })
  );
}
