export class PropertyUndefinedError extends Error {
  public static match (expectedProperty: string): (value: Error) => boolean {
    const result: (value: Error) => boolean = (value) => {
      if (!(value instanceof PropertyUndefinedError)) {
        return false;
      }

      return value.propertyName === expectedProperty;
    };
    return result;
  }

  public static assert<TValue>(value: TValue | undefined, propertyName: any): TValue {
    if (value === undefined) {
      throw new PropertyUndefinedError(propertyName);
    }
    return value;
  }

  constructor(public readonly propertyName: string) {
    super(`Expected property '${propertyName}' to be defined`);
  }
}
