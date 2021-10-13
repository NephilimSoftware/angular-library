export class ValidationError {
  public isEqual(error: ValidationError): boolean {
    return this === error;
  }

  public toString(): string {
    return `[${this.constructor.name}]`;
  }
}

export class ValueIsRequiredValidationError extends ValidationError {
  public isEqual(error: ValidationError): boolean {
    return error instanceof ValueIsRequiredValidationError;
  }

  public toString(): string {
    return 'This field is required.';
  }
}

export class ChildValidationError<TValidationError extends ValidationError = ValidationError> extends ValidationError {
  public static forPath(path: string): (validationErrors: ValidationError[]) => ChildValidationError[] {
    const result: (validationErrors: ValidationError[]) => ChildValidationError[] = (
      validationErrors: ValidationError[]
    ) => validationErrors.map((validationError) => new ChildValidationError(path, validationError));
    return result;
  }

  constructor(public readonly path: string, public readonly targetValidationError: TValidationError) {
    super();
  }

  public isEqual(error: ValidationError): boolean {
    return (
      error instanceof ChildValidationError &&
      this.path === error.path &&
      this.targetValidationError.isEqual(error.targetValidationError)
    );
  }

  public toString(): string {
    return `${this.path} > ${this.targetValidationError}`;
  }
}

export class TextIsNotAnEmailValidationError extends ValidationError {
  public isEqual(error: ValidationError): boolean {
    return error instanceof TextIsNotAnEmailValidationError;
  }

  public toString(): string {
    return 'This not a valid e-mail address.';
  }
}

export class TextDoesNotMatchRegExpValidationError extends ValidationError {
  public isEqual(error: ValidationError): boolean {
    return error instanceof TextDoesNotMatchRegExpValidationError;
  }

  constructor(public readonly regExp: RegExp, public readonly description?: string) {
    super();
  }

  public toString(): string {
    return this.description ? `Text is not a valid ${this.description}.` : `Text doesn't match ${this.regExp}.`;
  }
}

export class TextIsToLongValidationError extends ValidationError {
  public isEqual(error: ValidationError): boolean {
    return error instanceof TextIsToLongValidationError;
  }

  constructor(public readonly maxLength: number) {
    super();
  }

  public toString(): string {
    return `Text can not have more than ${this.maxLength} characters.`;
  }
}

export class TextIsToShortValidationError extends ValidationError {
  public isEqual(error: ValidationError): boolean {
    return error instanceof TextIsToShortValidationError;
  }

  constructor(public readonly minLength: number) {
    super();
  }

  public toString(): string {
    return `Text must have at least ${this.minLength} characters.`;
  }
}

export class ArrayIsToLongValidationError extends ValidationError {
  public isEqual(error: ValidationError): boolean {
    return error instanceof ArrayIsToLongValidationError;
  }

  constructor(public readonly maxLength: number) {
    super();
  }

  public toString(): string {
    return `List can not have more than ${this.maxLength} items.`;
  }
}

export class ArrayIsToShortValidationError extends ValidationError {
  public isEqual(error: ValidationError): boolean {
    return error instanceof ArrayIsToShortValidationError;
  }

  constructor(public readonly minLength: number) {
    super();
  }

  public toString(): string {
    return `List must have at least ${this.minLength} items.`;
  }
}

export class NumberIsEqualToValidationError extends ValidationError {
  public isEqual(error: ValidationError): boolean {
    return error instanceof NumberIsEqualToValidationError;
  }

  constructor(public readonly expectedValue: number) {
    super();
  }

  public toString(): string {
    return `Value can not be equal to ${this.expectedValue}.`;
  }
}

export class NumberIsGreaterThanValidationError extends ValidationError {
  public isEqual(error: ValidationError): boolean {
    return error instanceof NumberIsGreaterThanValidationError;
  }

  constructor(public readonly max: number) {
    super();
  }

  public toString(): string {
    return `Value can not be greater than ${this.max}.`;
  }
}

export class NumberIsLowerThanValidationError extends ValidationError {
  public isEqual(error: ValidationError): boolean {
    return error instanceof NumberIsLowerThanValidationError;
  }

  constructor(public readonly min: number) {
    super();
  }

  public toString(): string {
    return `Value can not be lower than ${this.min}.`;
  }
}
