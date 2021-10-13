import {InputValue} from '../input-value';
import {IInputValueStrategy} from './input-value-strategy';

export class DateStrategy implements IInputValueStrategy<Date | null> {
  public get(input: HTMLInputElement): Date | null {
    return input.valueAsDate;
  }

  public set(input: HTMLInputElement, value: Date | null): void {
    input.valueAsDate = value;
  }

  public isEqual(a: Date | null, b: Date | null): boolean {
    if (a === null && b === null) {
      return true;
    }

    if (a === null || b === null) {
      return false;
    }

    return a.getTime() === b.getTime();
  }

  public validate(value: InputValue): Date | null {
    if (value === null) {
      return null;
    }

    if (value instanceof Date) {
      return value;
    }

    if (typeof value === 'number') {
      return new Date(value);
    }

    if (typeof value === 'string') {
      const result: Date = new Date(value);
      return isNaN(+result) ? null : result;
    }

    return null;
  }

  public canBeDispatched(value: Date | null): boolean {
    return true;
  }
}
