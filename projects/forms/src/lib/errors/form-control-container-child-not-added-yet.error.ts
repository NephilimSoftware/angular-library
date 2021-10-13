export class FormControlContainerChildNotAddedYetError extends Error {
  public static match(value: Error): boolean {
    return value instanceof FormControlContainerChildNotAddedYetError;
  }

  constructor(name: string) {
    super(`Control with name '${name}' was not added yet.`);
  }
}
