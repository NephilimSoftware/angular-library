import {IsEqual} from '../object';
import {PropertySubjectChangedEvent} from './property-subject-changed.event';
import {PropertySubjectChangingEvent} from './property-subject-changing.event';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {filter} from 'rxjs/operators';

export class PropertySubject<TValue> extends BehaviorSubject<TValue> {
  private readonly _changing: Subject<PropertySubjectChangingEvent<TValue>> = new Subject<
    PropertySubjectChangingEvent<TValue>
  >();
  private readonly _changed: Subject<PropertySubjectChangedEvent<TValue>> = new Subject<
    PropertySubjectChangedEvent<TValue>
  >();

  public readonly changing: Observable<PropertySubjectChangingEvent<TValue>> = this._changing.pipe(
    filter((event) => !event.wasCancelled)
  );
  public readonly changed: Observable<PropertySubjectChangedEvent<TValue>> = this._changed;

  public constructor(initialValue: TValue, private readonly _isEqual: IsEqual<TValue> = (a, b) => a === b) {
    super(initialValue);
  }

  public get(): TValue {
    return this.getValue();
  }

  public set(value: TValue): void {
    const previousValue: TValue = this.get();
    if (this._isEqual(previousValue, value)) {
      return;
    }
    const changingEvent: PropertySubjectChangingEvent<TValue> = new PropertySubjectChangingEvent(previousValue, value);
    this._changing.next(changingEvent);
    if (changingEvent.error !== null) {
      throw changingEvent.error;
    }
    if (changingEvent.wasCancelled) {
      return;
    }

    this.next(value);
    this._changed.next(new PropertySubjectChangedEvent(previousValue, value));
  }

  public destroy(): void {
    this.complete();
    this._changed.complete();
    this._changing.complete();
  }
}
