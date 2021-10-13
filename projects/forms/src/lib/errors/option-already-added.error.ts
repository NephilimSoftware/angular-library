export class OptionAlreadyAddedError extends Error {
  public static match(value: Error): boolean {
    return value instanceof OptionAlreadyAddedError;
  }

  constructor() {
    super(`Option was already added.`);
  }
}
