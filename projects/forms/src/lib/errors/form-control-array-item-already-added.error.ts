export class FormControlArrayItemAlreadyAddedError extends Error {
  public static match(value: Error): boolean {
    return value instanceof FormControlArrayItemAlreadyAddedError;
  }

  constructor(index: number) {
    super(`Control already added on index ${index}.`);
  }
}
