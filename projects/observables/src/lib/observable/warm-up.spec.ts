import {Observable, Subscriber} from 'rxjs';
import {wrapCallbackWithSpy} from '../callback.spec';
import {warmUp} from './warm-up';
import Spy = jasmine.Spy;

describe('warmUp', () => {
  let observableTask: Spy;
  let observable: Observable<number>;

  beforeEach(() => {
    observableTask = wrapCallbackWithSpy((observer: Subscriber<number>) => observer.next(333));
    observable = new Observable<number>(observableTask);
  });

  it('returns the same observable', () => {
    expect(observable).toEqual(warmUp(observable));
  });

  it('warms up an observable', () => {
    expect(observableTask).toHaveBeenCalledTimes(0);
    warmUp(observable);
    expect(observableTask).toHaveBeenCalledTimes(1);
  });
});
