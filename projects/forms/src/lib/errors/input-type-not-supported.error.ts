import {InputType} from '../model/input-type';

export class InputTypeNotSupportedError extends Error {
  public static match(value: Error): boolean {
    return value instanceof InputTypeNotSupportedError;
  }

  constructor(inputType: InputType) {
    super(`InputType: "${inputType}" is not supported.`);
  }
}
