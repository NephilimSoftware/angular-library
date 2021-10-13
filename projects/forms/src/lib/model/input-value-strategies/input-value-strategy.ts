import {InputValue} from '../input-value';

export interface IInputValueStrategy<TValue = InputValue> {
  get(input: HTMLInputElement): TValue;
  set(input: HTMLInputElement, value: TValue): void;
  isEqual(a: TValue, b: TValue): boolean;
  validate(value: InputValue): TValue;
  canBeDispatched(value: TValue): boolean;
}
