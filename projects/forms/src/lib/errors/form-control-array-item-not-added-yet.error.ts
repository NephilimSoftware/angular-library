export class FormControlArrayItemNotAddedYetError extends Error {
  public static match(value: Error): boolean {
    return value instanceof FormControlArrayItemNotAddedYetError;
  }

  constructor() {
    super(`Control was not added yet.`);
  }
}
