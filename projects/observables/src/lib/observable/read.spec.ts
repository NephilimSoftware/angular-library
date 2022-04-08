import {SynchronousReadError} from '../errors/synchronous-read.error';
import {readSynchronously} from './read';
import {AsyncSubject, BehaviorSubject, from, Observable, ReplaySubject} from 'rxjs';

describe('readSynchronously', () => {
  it('returns value from BehaviorSubject', () => {
    const subject: BehaviorSubject<string> = new BehaviorSubject<string>('Nephilim');
    expect(readSynchronously(subject)).toBe('Nephilim');
  });
  it('returns value from ReplaySubject that contains value', () => {
    const subject: ReplaySubject<string> = new ReplaySubject<string>(1);
    subject.next('Nephilim');
    expect(readSynchronously(subject)).toBe('Nephilim');
  });
  it('returns first value from ReplaySubject', () => {
    const subject: ReplaySubject<string> = new ReplaySubject<string>(3);
    subject.next('Fura');
    subject.next('Janusz');
    subject.next('Gawendi');
    subject.next('Nephilim');
    expect(readSynchronously(subject)).toBe('Janusz');
  });

  it('throws error for observable created from Promise', () => {
    const observable: Observable<string> = from(new Promise<string>((resolve) => resolve('Nephilim')));

    expect(() => {
      readSynchronously(observable);
    }).toThrowMatching((error) => error instanceof SynchronousReadError);
  });

  it('throws error for not completed AsyncSubject', () => {
    const subject: AsyncSubject<string> = new AsyncSubject<string>();
    subject.next('Nephilim');

    expect(() => {
      readSynchronously(subject);
    }).toThrowMatching((error) => error instanceof SynchronousReadError);
  });
});
