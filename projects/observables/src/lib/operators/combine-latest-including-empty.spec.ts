import {BehaviorSubject} from 'rxjs';
import {createCallbackSpy} from '../callback.spec';
import {combineLatestIncludingEmpty} from './combine-latest-including-empty';
import Spy = jasmine.Spy;

describe('combineLatestIncludingEmpty', () => {
  let callback: Spy;

  beforeEach(() => {
    callback = createCallbackSpy();
  });

  it('returns observable with empty array when empty array was passed as parameter', () => {
    combineLatestIncludingEmpty([]).subscribe(callback);
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith([]);
  });

  it('returns observable with array of values from passed observables', () => {
    combineLatestIncludingEmpty([new BehaviorSubject('first'), new BehaviorSubject('second')]).subscribe(callback);
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(['first', 'second']);
  });

  it('returns observable that updates when value of passed observable has changed', () => {
    const observables: BehaviorSubject<string>[] = [new BehaviorSubject('first'), new BehaviorSubject('second')];
    combineLatestIncludingEmpty(observables).subscribe(callback);

    observables[1].next('third');

    expect(callback).toHaveBeenCalledTimes(2);
    expect(callback).toHaveBeenCalledWith(['first', 'third']);
  });
});
