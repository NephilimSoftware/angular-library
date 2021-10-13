import {BehaviorSubject, Observable, Subject, Subscription} from 'rxjs';
import {map, skip, switchMap} from 'rxjs/operators';
import {PropertyUndefinedError} from '../../errors/property-undefined.error';
import {FormPropertyChangedEvent} from '../../events/form-property-changed.event';
import {IFormControlProperty} from '../api';
import {keys} from '../object';
import {combineLatestIncludingEmpty, latest} from '../observables';
import {valueEquals} from '../value-equals';

export declare type IFormControlContainerPropertyChildren<TValue> = {
  [TName in keyof TValue]?: IFormControlProperty<TValue[TName]>;
};

interface KeyValue<TObject, TKey extends keyof TObject = keyof TObject, TValue = TObject[TKey]> {
  key: TKey;
  value: TValue;
}

export class FormControlContainerProperty<TValue>
  extends BehaviorSubject<TValue>
  implements IFormControlProperty<TValue> {
  private static createValueFromKeyValues<TValue>(keyValues: KeyValue<TValue>[]): TValue {
    const result: TValue = <TValue>{};
    keyValues.forEach((item) => {
      result[item.key] = item.value;
    });
    return result;
  }

  private static createKeyValueForChildOnKey<TValue>(
    children: IFormControlContainerPropertyChildren<TValue>
  ): (key: keyof TValue) => Observable<KeyValue<TValue>> {
    const result: (key: keyof TValue) => Observable<KeyValue<TValue>> = (
      key: keyof TValue
    ): Observable<KeyValue<TValue>> =>
      PropertyUndefinedError.assert(children[key]?.pipe(map((value): KeyValue<TValue> => ({key, value}))), key);
    return result;
  }

  private static setChildrenValue<TValue>(
    children: IFormControlContainerPropertyChildren<TValue>,
    value: TValue
  ): void {
    keys(value).forEach(<TKey extends keyof TValue = keyof TValue>(key: TKey) => {
      const child: IFormControlProperty<TValue[TKey]> | undefined = children[key];
      if (child) {
        child.set(value[key]);
      }
    });
  }

  private _currentValueSubscription: Subscription | null = null;

  private readonly _changed: Subject<FormPropertyChangedEvent<TValue>> = new Subject<
    FormPropertyChangedEvent<TValue>
  >();
  public readonly changed: Observable<FormPropertyChangedEvent<TValue>> = this._changed;

  private readonly _currentValue: Observable<TValue> = this._children.pipe(
    switchMap((children) =>
      combineLatestIncludingEmpty(
        keys(children).map(FormControlContainerProperty.createKeyValueForChildOnKey<TValue>(children))
      ).pipe(map(FormControlContainerProperty.createValueFromKeyValues))
    )
  );

  constructor(private readonly _children: Observable<IFormControlContainerPropertyChildren<TValue>>) {
    super(<TValue>{});
    latest(this._currentValue).subscribe(this._set);
    this._startListeningForChanges();
  }

  public get(): TValue {
    return this.value;
  }

  public set(value: TValue): void {
    const previousValue: TValue = this.get();
    if (valueEquals(previousValue, value)) {
      return;
    }

    latest(this._children).subscribe((children) => {
      this._stopListeningForChanges();
      FormControlContainerProperty.setChildrenValue(children, value);
      this._startListeningForChanges();

      latest(this._currentValue).subscribe((currentValue) => {
        if (!valueEquals(previousValue, currentValue)) {
          this._set(currentValue);
          this._changed.next(new FormPropertyChangedEvent(previousValue, currentValue));
        }
      });
    });
  }

  public destroy(): void {
    this._stopListeningForChanges();
  }

  private _startListeningForChanges(): void {
    if (!this._currentValueSubscription) {
      this._currentValueSubscription = this._currentValue.pipe(skip(1)).subscribe(this._set);
    }
  }

  private _stopListeningForChanges(): void {
    if (this._currentValueSubscription) {
      this._currentValueSubscription.unsubscribe();
      this._currentValueSubscription = null;
    }
  }

  private readonly _set = (value: TValue): void => {
    this.next(value);
  };
}
