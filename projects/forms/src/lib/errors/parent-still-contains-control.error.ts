export class ParentStillContainsControlError extends Error {
  public static match(value: Error): boolean {
    return value instanceof ParentStillContainsControlError;
  }

  constructor() {
    super('Parent still contains this control. Use parents remove() method to set this property.');
  }
}
