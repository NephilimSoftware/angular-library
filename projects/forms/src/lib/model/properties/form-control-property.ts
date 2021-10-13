import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {filter} from 'rxjs/operators';
import {FormPropertyChangedEvent} from '../../events/form-property-changed.event';
import {FormPropertyChangingEvent} from '../../events/form-property-changing.event';
import {IFormControlProperty} from '../api';
import {IsEqual} from '../object';

export class FormControlProperty<TValue> extends BehaviorSubject<TValue> implements IFormControlProperty<TValue> {
  private readonly _changing: Subject<FormPropertyChangingEvent<TValue>> = new Subject<
    FormPropertyChangingEvent<TValue>
  >();
  private readonly _changed: Subject<FormPropertyChangedEvent<TValue>> = new Subject<
    FormPropertyChangedEvent<TValue>
  >();

  public readonly changing: Observable<FormPropertyChangingEvent<TValue>> = this._changing.pipe(
    filter((event) => !event.wasCancelled)
  );
  public readonly changed: Observable<FormPropertyChangedEvent<TValue>> = this._changed;

  constructor(initialValue: TValue, private readonly _isEqual: IsEqual<TValue> = (a, b) => a === b) {
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
    const changingEvent: FormPropertyChangingEvent<TValue> = new FormPropertyChangingEvent(previousValue, value);
    this._changing.next(changingEvent);
    if (changingEvent.error !== null) {
      throw changingEvent.error;
    }
    if (changingEvent.wasCancelled) {
      return;
    }

    this.next(value);
    this._changed.next(new FormPropertyChangedEvent(previousValue, value));
  }

  public destroy(): void {
    this.complete();
    this._changed.complete();
    this._changing.complete();
  }
}
