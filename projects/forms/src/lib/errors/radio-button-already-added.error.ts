export class RadioButtonAlreadyAddedError extends Error {
  public static match(value: Error): boolean {
    return value instanceof RadioButtonAlreadyAddedError;
  }

  constructor(group: string) {
    super(`Radio button was already added to group ${group}.`);
  }
}
