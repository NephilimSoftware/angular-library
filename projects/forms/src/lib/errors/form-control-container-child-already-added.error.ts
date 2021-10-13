export class FormControlContainerChildAlreadyAddedError extends Error {
  public static match(value: Error): boolean {
    return value instanceof FormControlContainerChildAlreadyAddedError;
  }

  constructor(name: string) {
    super(`Control with name '${name}' was already added to group.`);
  }
}
