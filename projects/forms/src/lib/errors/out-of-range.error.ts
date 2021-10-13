export class OutOfRangeError extends Error {
  public static match(value: Error): boolean {
    return value instanceof OutOfRangeError;
  }

  public static assert(min: number, value: number, max: number): void {
    if (value < min || max < value) {
      throw new OutOfRangeError(0, value);
    }
  }

  constructor(min: number, max: number) {
    super(`Value out of range, should be between ${min} and ${max}`);
  }
}
