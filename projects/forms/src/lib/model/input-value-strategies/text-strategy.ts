import {InputValue} from '../input-value';
import {IInputValueStrategy} from './input-value-strategy';

export class TextStrategy implements IInputValueStrategy<string> {
  public get(input: HTMLInputElement): string {
    return input.value;
  }

  public set(input: HTMLInputElement, value: string): void {
    input.value = value;
  }

  public isEqual(a: string, b: string): boolean {
    return a === b;
  }

  public validate(value: InputValue): string {
    if (value === null) {
      return '';
    }

    if (value instanceof Date) {
      return value.toISOString();
    }

    if (typeof value === 'boolean') {
      return value ? 'on' : '';
    }

    return (typeof value === 'string') ? value : value.toString();
  }

  public canBeDispatched(value: string): boolean {
    return true;
  }
}
