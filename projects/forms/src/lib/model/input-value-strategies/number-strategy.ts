import {InputValue} from '../input-value';
import {IInputValueStrategy} from './input-value-strategy';

export class NumberStrategy implements IInputValueStrategy<number> {
  public get(input: HTMLInputElement): number {
    return input.valueAsNumber;
  }
  public set(input: HTMLInputElement, value: number): void {
    input.valueAsNumber = value;
  }

  public isEqual(a: number, b: number): boolean {
    return a === b;
  }

  public validate(value: InputValue): number {
    if (!value) {
      return 0;
    }

    value = +value;

    return isNaN(value) ? 0 : value;
  }

  public canBeDispatched(value: number): boolean {
    return !isNaN(value);
  }
}
