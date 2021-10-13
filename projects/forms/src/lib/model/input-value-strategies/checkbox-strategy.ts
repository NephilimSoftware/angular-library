import {InputValue} from '../input-value';
import {IInputValueStrategy} from './input-value-strategy';

export class CheckboxStrategy implements IInputValueStrategy<boolean> {
  public get(input: HTMLInputElement): boolean {
    return input.checked;
  }

  public set(input: HTMLInputElement, value: boolean): void {
    input.checked = value;
  }

  public isEqual(a: boolean, b: boolean): boolean {
    return a === b;
  }

  public validate(value: InputValue): boolean {
    return !!value;
  }

  public canBeDispatched(value: boolean): boolean {
    return true;
  }
}
