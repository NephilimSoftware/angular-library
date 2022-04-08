import {AbstractControl, AbstractControlOptions, AsyncValidatorFn, FormArray, ValidatorFn} from '@angular/forms';
import {combineLatestIncludingEmpty, read} from '@nephilimSoftwarePackages/observables';
import {BehaviorSubject, merge, Observable} from 'rxjs';
import {switchMap} from 'rxjs/operators';

export class ArrayFormGroup<TItemFormGroup extends AbstractControl> extends FormArray {
  private readonly _items: BehaviorSubject<TItemFormGroup[]> = new BehaviorSubject<TItemFormGroup[]>([]);
  public readonly items: Observable<TItemFormGroup[]> = this._items;

  public constructor(
    controls?: TItemFormGroup[],
    validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null
  ) {
    super([], validatorOrOpts, asyncValidator);
    this.setItems(controls || []);
  }

  public push(control: TItemFormGroup): void {
    super.push(control);
    this._updateObservable();
  }

  public insert(index: number, control: TItemFormGroup): void {
    super.insert(index, control);
    this._updateObservable();
  }

  public setItems(items: TItemFormGroup[]): void {
    this._removeAllItems();
    items.forEach((item) => super.push(item));
    this._updateObservable();
  }

  public removeAt(index: number): void {
    this._removeAt(index);
    this._updateObservable();
  }

  public removeItem(form: TItemFormGroup): void {
    const index: number = this._items.value.indexOf(form);
    if (index > -1) {
      this.removeAt(index);
    }
  }

  public removeAllItems(): void {
    this._removeAllItems();
    this._updateObservable();
  }

  public merge<TValue>(selectValue: (item: TItemFormGroup) => Observable<TValue>): Observable<TValue> {
    return this.items.pipe(switchMap((items) => merge(...items.map(selectValue))));
  }

  public combine<TValue>(project: (item: TItemFormGroup) => Observable<TValue>): Observable<TValue[]> {
    return this.items.pipe(switchMap((item) => combineLatestIncludingEmpty(item.map(project))));
  }

  public async fetch<TResult>(
    getResult: (item: TItemFormGroup) => Promise<TResult | undefined>
  ): Promise<TResult | undefined> {
    for (const item of await read(this.items)) {
      const result: TResult | undefined = await getResult(item);
      if (result !== undefined) {
        return result;
      }
    }
    return undefined;
  }

  private _removeAllItems(): void {
    const length: number = this.controls.length;
    for (let i: number = 0; i < length; i++) {
      this._removeAt(0);
    }
  }

  private _removeAt(index: number): void {
    super.removeAt(index);
  }

  private _updateObservable(): void {
    this._items.next(this.controls as TItemFormGroup[]);
  }
}
