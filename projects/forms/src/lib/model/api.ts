import {Observable} from 'rxjs';
import {filter, map, take} from 'rxjs/operators';
import {FormPropertyChangedEvent} from '../events/form-property-changed.event';
import {ValidationError} from './validation-errors';

export async function untilIsReady<TValue>(control: IFormControl<TValue>): Promise<void> {
  return control.isValidating
    .pipe(
      filter((v) => !v),
      map(() => {}),
      take(1)
    )
    .toPromise<void>();
}

export namespace IFormControl {
  export function setEnabled<TValue>(control: IFormControl<TValue>): (isEnabled: boolean) => void {
    return (isEnabled) => {
      if (isEnabled) {
        control.enable();
      } else {
        control.disable();
      }
    };
  }

  export function setDisabled<TValue>(control: IFormControl<TValue>): (isDisabled: boolean) => void {
    const setIsEnabled: (isEnabled: boolean) => void = setEnabled(control);
    return (isDisabled) => setIsEnabled(!isDisabled);
  }
}

export declare type IFormControlContainerChildren<TValue> = {
  [TName in keyof TValue]?: IFormControl<TValue[TName]>;
};

export type IValidateFormValue<TValue> = (
  value: TValue
) => Promise<ValidationError[]> | Observable<ValidationError[]> | ValidationError[];

export abstract class IReadonlyFormControlProperty<TValue> extends Observable<TValue> {
  public abstract changed: Observable<FormPropertyChangedEvent<TValue>>;
  public abstract get(): TValue;
  public abstract destroy(): void;
}

export abstract class IFormControlProperty<TValue> extends IReadonlyFormControlProperty<TValue> {
  public abstract set(value: TValue): void;
}

export interface IFormControl<TValue = any> {
  value: IFormControlProperty<TValue>;
  parent: IFormControlProperty<IFormControlParent | null>;

  isDisabled: Observable<boolean>;
  isEnabled: Observable<boolean>;

  isDirty: Observable<boolean>;
  isPristine: Observable<boolean>;

  wasTouched: Observable<boolean>;
  isUntouched: Observable<boolean>;

  validationErrors: Observable<ValidationError[]>;
  isValid: Observable<boolean>;
  isInvalid: Observable<boolean>;
  isValidating: Observable<boolean>;

  disable(): void;
  enable(): void;
  markAsDirty(): void;
  markAsPristine(): void;
  markAsTouched(): void;
  markAsUntouched(): void;

  destroy(): void;
}

export namespace IFormControlContainer {
  export function setChild<TValue, TKey extends keyof TValue = keyof TValue>(
    container: IFormControlContainer<TValue>,
    name: TKey,
    control: IFormControl<TValue[TKey]>
  ): (isChild: boolean) => void {
    return (isChild) => {
      if (isChild) {
        if (control.parent.get() !== container) {
          container.add(name, control);
        }
        control.enable();
      } else {
        if (control.parent.get() !== null) {
          container.remove(name);
        }
        control.disable();
      }
    };
  }
}

export interface IFormControlParent<TValue = any, TChildValue = any> extends IFormControl<TValue> {
  contains(control: IFormControl<TChildValue>): boolean;
}

export interface IFormControlContainer<TValue = any> extends IFormControlParent<TValue, TValue[keyof TValue]> {
  add<TKey extends keyof TValue = keyof TValue, TFormControl extends IFormControl = IFormControl>(
    name: TKey,
    control: TFormControl
  ): TFormControl;
  remove(name: keyof TValue): void;
}

export interface IFormControlArray<
  TItemValue,
  TItemFormControl extends IFormControl<TItemValue> = IFormControl<TItemValue>
> extends IFormControlParent<TItemValue[], TItemValue> {
  items: IFormControlProperty<TItemFormControl[]>;
  push(control: TItemFormControl): void;
  insertAt(index: number, control: TItemFormControl): void;
  remove(control: TItemFormControl): void;
}
