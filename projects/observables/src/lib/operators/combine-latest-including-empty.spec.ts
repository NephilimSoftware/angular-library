import {Observable, Subscriber} from 'rxjs';
import {createCallbackSpy, wrapCallbackWithSpy} from '../callback.spec';
import {combineLatestIncludingEmpty} from './combine-latest-including-empty';
import Spy = jasmine.Spy;

describe('combineLatestIncludingEmpty', () => {
  let callback: Spy;
  let observableTask: Spy;
  let observable: Observable<number>;

  beforeEach(() => {
    callback = createCallbackSpy();
    observableTask = wrapCallbackWithSpy((observer: Subscriber<number>) => observer.next(333));
    observable = new Observable<number>(observableTask);
  });

  it('subscribes even when array is empty', () => {
    combineLatestIncludingEmpty([]).subscribe(callback);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('subscribes when array is not empty', () => {
    combineLatestIncludingEmpty([observable]).subscribe(callback);
    expect(callback).toHaveBeenCalledTimes(1);
  });
});
