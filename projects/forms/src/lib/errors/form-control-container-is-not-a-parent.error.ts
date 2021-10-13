export class FormControlContainerIsNotAParentError extends Error {
  public static match(value: Error): boolean {
    return value instanceof FormControlContainerIsNotAParentError;
  }

  constructor() {
    super('Passed parent is not a valid parent. Use parents add() method to set this property.');
  }
}
