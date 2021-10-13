import {InputValue} from '../input-value';
import {IInputValueStrategy} from './input-value-strategy';

export class FileStrategy implements IInputValueStrategy<FileList | null> {
  public get(input: HTMLInputElement): FileList | null {
    return input.files;
  }

  public set(input: HTMLInputElement, value: FileList | null): void {
    input.files = value;
  }

  public isEqual(a: FileList | null, b: FileList | null): boolean {
    return a === b;
  }

  public validate(value: InputValue): FileList | null {
    return value instanceof FileList ? value : null;
  }

  public canBeDispatched(value: FileList | null): boolean {
    return true;
  }
}
