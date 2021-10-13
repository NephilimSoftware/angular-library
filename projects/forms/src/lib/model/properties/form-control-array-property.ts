import {BehaviorSubject, Observable, Subject, Subscription} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import {OutOfRangeError} from '../../errors/out-of-range.error';
import {FormPropertyChangedEvent} from '../../events/form-property-changed.event';
import {IFormControl, IFormControlProperty} from '../api';
import {isEqual} from '../array';
import {IsEqual} from '../object';
import {combineLatestIncludingEmpty} from '../observables';

export class FormControlArrayProperty<
    TItemValue,
    TItemFormControl extends IFormControl<TItemValue> = IFormControl<TItemValue>
  >
  extends BehaviorSubject<TItemValue[]>
  implements IFormControlProperty<TItemValue[]> {
  private readonly _itemsSubscription: Subscription;

  private readonly _changed: Subject<FormPropertyChangedEvent<TItemValue[]>> = new Subject<
    FormPropertyChangedEvent<TItemValue[]>
  >();
  public readonly changed: Observable<FormPropertyChangedEvent<TItemValue[]>> = this._changed;

  constructor(
    initialValue: TItemValue[],
    private readonly _items: Observable<TItemFormControl[]>,
    private readonly _updateItems: (value: TItemValue[]) => void,
    private readonly _isEqual: IsEqual<TItemValue> = (a, b) => a === b
  ) {
    super([]);

    this.set(initialValue);

    this._itemsSubscription = this._items
      .pipe(
        switchMap((formControls) => combineLatestIncludingEmpty(formControls.map((formControl) => formControl.value)))
      )
      .subscribe((values) => this.next(values));
  }

  public get(): TItemValue[] {
    return this.value;
  }

  public set(value: TItemValue[]): void {
    const previousValue: TItemValue[] = this.get();
    if (!isEqual(previousValue, value, this._isEqual)) {
      this._updateItems(value);
      const currentValue: TItemValue[] = this.get();
      if (!isEqual(previousValue, currentValue, this._isEqual)) {
        this._changed.next(new FormPropertyChangedEvent<TItemValue[]>(previousValue, currentValue));
      }
    }
  }

  public push(item: TItemValue): void {
    this.set([...this.get(), item]);
  }

  public move(fromIndex: number, toIndex: number): void {
    if (fromIndex === toIndex) {
      return;
    }
    const currentValue: TItemValue[] = this.get();
    OutOfRangeError.assert(0, fromIndex, currentValue.length - 1);
    OutOfRangeError.assert(0, toIndex, currentValue.length - 1);

    const updatedValue: TItemValue[] = currentValue.concat();
    const movedItem: TItemValue[] = updatedValue.splice(fromIndex, 1);
    updatedValue.splice(toIndex, 0, ...movedItem);
    this.set(updatedValue);
  }

  public insertAt(index: number, item: TItemValue): void {
    const currentValue: TItemValue[] = this.get();
    OutOfRangeError.assert(0, index, currentValue.length);

    const updatedValue: TItemValue[] = currentValue.concat();
    updatedValue.splice(index, 0, item);
    this.set(updatedValue);
  }

  public removeAt(index: number): void {
    const currentValue: TItemValue[] = this.get();
    OutOfRangeError.assert(0, index, currentValue.length - 1);

    const updatedValue: TItemValue[] = currentValue.concat();
    updatedValue.splice(index, 1);
    this.set(updatedValue);
  }

  public remove(shouldBeRemoved: (item: TItemValue) => boolean): void {
    this.set(this.get().filter((item) => !shouldBeRemoved(item)));
  }

  public destroy(): void {
    this._itemsSubscription.unsubscribe();
  }
}
