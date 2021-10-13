import {combineLatest, merge, BehaviorSubject, Observable, Subject, Subscription} from 'rxjs';
import {distinctUntilChanged, map, switchMap} from 'rxjs/operators';
import {FormControlArrayItemAlreadyAddedError} from '../errors/form-control-array-item-already-added.error';
import {FormControlArrayItemNotAddedYetError} from '../errors/form-control-array-item-not-added-yet.error';
import {OutOfRangeError} from '../errors/out-of-range.error';
import {FormControlArrayItemAddedEvent} from '../events/form-control-array-item-added.event';
import {FormControlArrayItemRemovedEvent} from '../events/form-control-array-item-removed.event';
import {FormPropertyChangedEvent} from '../events/form-property-changed.event';
import {IFormControl, IFormControlArray, IFormControlParent, IFormControlProperty} from './api';
import {flatten} from './array';
import {IsEnabledFeature} from './features/is-enabled.feature';
import {FormControlParentGuard} from './form-control-parent-guard';
import {IsEqual} from './object';
import {allAreTrue, atLeastOneIsTrue, combineLatestIncludingEmpty, negate} from './observables';
import {FormControlArrayProperty} from './properties/form-control-array-property';
import {FormControlProperty} from './properties/form-control-property';
import {ChildValidationError} from './validation-errors';

export class FormArray<
  TItemValue = any,
  TItemFormControl extends IFormControl<TItemValue> = IFormControl<TItemValue>
> implements IFormControlArray<TItemValue, TItemFormControl> {
  private readonly _items: FormControlProperty<TItemFormControl[]> = new FormControlProperty<
    TItemFormControl[]
  >([]);
  private readonly _value: FormControlArrayProperty<TItemValue>;
  public readonly value: IFormControlProperty<TItemValue[]>;
  public readonly parent: FormControlProperty<IFormControlParent | null>;
  public readonly items: IFormControlProperty<TItemFormControl[]> = this._items;

  private readonly _isEnabledFeature: IsEnabledFeature;

  public readonly isEnabled: Observable<boolean>;
  public readonly isDisabled: Observable<boolean>;

  private readonly _isUntouched: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  public readonly isUntouched: Observable<boolean>;
  public readonly wasTouched: Observable<boolean>;

  private readonly _isPristine: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  public readonly isPristine: Observable<boolean>;
  public readonly isDirty: Observable<boolean>;

  public readonly isValidating: Observable<boolean>;
  public readonly validationErrors: Observable<ChildValidationError[]>;
  public readonly isValid: Observable<boolean>;
  public readonly isInvalid: Observable<boolean>;

  private readonly _parentGuard: FormControlParentGuard<TItemValue[]>;

  private readonly _itemAdded: Subject<FormControlArrayItemAddedEvent<TItemValue>> = new Subject<
    FormControlArrayItemAddedEvent<TItemValue>
  >();
  public readonly itemAdded: Observable<FormControlArrayItemAddedEvent<TItemValue>> = this._itemAdded;

  private readonly _itemRemoved: Subject<FormControlArrayItemRemovedEvent<TItemValue>> = new Subject<
    FormControlArrayItemRemovedEvent<TItemValue>
  >();
  public readonly itemRemoved: Observable<FormControlArrayItemRemovedEvent<TItemValue>> = this._itemRemoved;

  private readonly _subscriptions: Subscription[];

  constructor(
    initialValue: TItemValue[],
    private readonly _createItem: (value: TItemValue) => TItemFormControl,
    private readonly _isEqual: IsEqual<TItemValue> = (a, b) => a === b
  ) {
    this._subscriptions = [
      this._items.changed.subscribe(this._onItemsChanged),
      this.itemAdded.subscribe(this._onItemAdded),
      this.itemRemoved.subscribe(this._onItemRemoved),
    ];

    this.value = this._value = new FormControlArrayProperty<TItemValue>(
      initialValue,
      this._items,
      this._updateFormControls,
      this._isEqual
    );

    this.parent = new FormControlProperty<IFormControlParent | null>(null);
    this._parentGuard = new FormControlParentGuard<TItemValue[]>(this, this.parent);

    this._isEnabledFeature = new IsEnabledFeature(this.parent);
    this.isEnabled = this._isEnabledFeature.isEnabled;
    this.isDisabled = this._isEnabledFeature.isDisabled;

    this.isValidating = this.combine((child) => child.isValidating).pipe(atLeastOneIsTrue());
    this.isUntouched = combineLatest([
      this._isUntouched,
      this.combine((child) => child.isUntouched).pipe(allAreTrue()),
    ]).pipe(allAreTrue());
    this.wasTouched = this.isUntouched.pipe(negate());
    this.isPristine = combineLatest([
      this._isPristine,
      this.combine((child) => child.isPristine).pipe(allAreTrue()),
    ]).pipe(allAreTrue());
    this.isDirty = this.isPristine.pipe(negate());

    this.validationErrors = this.combine((item, index) =>
      item.validationErrors.pipe(map(ChildValidationError.forPath(index.toString())))
    ).pipe(map(flatten));
    this.isValid = this.validationErrors.pipe(
      map((validationErrors) => validationErrors.length === 0),
      distinctUntilChanged()
    );
    this.isInvalid = this.isValid.pipe(negate());
  }

  public contains(control: TItemFormControl): boolean {
    return this.items.get().indexOf(control) > -1;
  }

  public readonly enable = (): void => {
    this._isEnabledFeature.enable();
  };
  public readonly disable = (): void => {
    this._isEnabledFeature.disable();
  };

  public readonly markAsDirty = (): void => {
    this._isPristine.next(false);
    this._forEachItem((child) => child.markAsDirty());
  };
  public readonly markAsPristine = (): void => {
    this._isPristine.next(true);
    this._forEachItem((child) => child.markAsPristine());
  };

  public readonly markAsTouched = (): void => {
    this._isUntouched.next(false);
    this._forEachItem((child) => child.markAsTouched());
  };
  public readonly markAsUntouched = (): void => {
    this._isUntouched.next(true);
    this._forEachItem((child) => child.markAsUntouched());
  };

  public push(control: TItemFormControl): void {
    this._assertNotContains(control);

    this._items.set([...this.items.get(), control]);
  }

  public insertAt(index: number, control: TItemFormControl): void {
    this._assertNotContains(control);
    this._assertIsInRange(index);

    const items: TItemFormControl[] = this.items.get().concat();
    items.splice(index, 0, control);
    this._items.set(items);
  }

  public remove(control: TItemFormControl): TItemFormControl {
    this._assertContains(control);

    this._items.set(this.items.get().filter((item) => item !== control));
    return control;
  }

  public merge<TResult>(
    project: (item: TItemFormControl, index: number) => Observable<TResult>
  ): Observable<TResult> {
    return this.items.pipe(switchMap((items) => merge(...items.map(project))));
  }

  public combine<TResult>(
    project: (item: TItemFormControl, index: number) => Observable<TResult>
  ): Observable<TResult[]> {
    return this.items.pipe(switchMap((item) => combineLatestIncludingEmpty(item.map(project))));
  }

  public destroy(): void {
    this._forEachItem((item) => item.destroy());
    this._subscriptions.forEach((subscription) => subscription.unsubscribe());
    this._isPristine.complete();
    this._isUntouched.complete();
    this.value.destroy();
    this._parentGuard.destroy();
    this.parent.destroy();
    this._isEnabledFeature.destroy();
  }

  private _forEachItem(callback: (child: TItemFormControl) => void): void {
    this.items.get().forEach(callback);
  }

  private _assertNotContains(control: TItemFormControl): void {
    if (this.contains(control)) {
      throw new FormControlArrayItemAlreadyAddedError(this.items.get().indexOf(control));
    }
  }

  private _assertContains(control: TItemFormControl): void {
    if (!this.contains(control)) {
      throw new FormControlArrayItemNotAddedYetError();
    }
  }

  private _assertIsInRange(index: number): void {
    const items: TItemFormControl[] = this.items.get();
    if (index < 0 || index > items.length) {
      throw new OutOfRangeError(0, items.length);
    }
  }

  private readonly _updateFormControls = (values: TItemValue[]): void => {
    const currentItems: TItemFormControl[] = this.items.get();
    const newItems: TItemFormControl[] = values.map(this._getOrCreateItem(currentItems));
    this._items.set(newItems);
  };

  private _getOrCreateItem(
    existingItems: TItemFormControl[]
  ): (value: TItemValue) => TItemFormControl {
    return (value) => {
      const existingItem: TItemFormControl | undefined = existingItems.find((item) =>
        this._isEqual(item.value.get(), value)
      );

      if (existingItem) {
        existingItems = existingItems.filter((item) => item !== existingItem);
        return existingItem;
      }

      return this._createItem(value);
    };
  }

  private readonly _onItemsChanged = (
    event: FormPropertyChangedEvent<TItemFormControl[]>
  ): void => {
    event.currentValue.forEach((control) => {
      if (event.previousValue.indexOf(control) < 0) {
        this._itemAdded.next(new FormControlArrayItemAddedEvent<TItemValue>(<any>control));
      }
    });
    event.previousValue.forEach((control) => {
      if (event.currentValue.indexOf(control) < 0) {
        this._itemRemoved.next(new FormControlArrayItemRemovedEvent<TItemValue>(<any>control));
      }
    });
  };

  private readonly _onItemAdded = (event: FormControlArrayItemRemovedEvent<TItemValue>): void => {
    event.item.parent.set(<any>this);
  };

  private readonly _onItemRemoved = (event: FormControlArrayItemRemovedEvent<TItemValue>): void => {
    event.item.parent.set(null);
  };
}
