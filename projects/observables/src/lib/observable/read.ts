import {SynchronousReadError} from '../errors/synchronous-read.error';
import {Observable} from 'rxjs';
import {take} from 'rxjs/operators';

export async function read<TValue>(observable: Observable<TValue>): Promise<TValue> {
  return observable.pipe(take(1)).toPromise();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const synchronousReadToken: any = {};
export function readSynchronously<TResult>(observable: Observable<TResult>): TResult {
  let result: TResult = synchronousReadToken;

  observable.pipe(take(1)).subscribe((value) => {
    result = value;
  });

  if (result === synchronousReadToken) {
    throw new SynchronousReadError();
  }

  return result;
}
