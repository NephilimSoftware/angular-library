import {
  ArrayIsToLongValidationError,
  ArrayIsToShortValidationError,
  NumberIsEqualToValidationError,
  NumberIsGreaterThanValidationError,
  NumberIsLowerThanValidationError,
  TextDoesNotMatchRegExpValidationError,
  TextIsNotAnEmailValidationError,
  TextIsToLongValidationError,
  TextIsToShortValidationError,
  ValueIsRequiredValidationError,
} from './validation-errors';

export namespace Validate {
  export class Text {
    private static readonly EMAIL_REGEXP: RegExp = /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    public static isAnEmail(v: string): TextIsNotAnEmailValidationError[] {
      return Text.EMAIL_REGEXP.test(v) ? [] : [new TextIsNotAnEmailValidationError()];
    }

    public static matchesRegExp(
      regExp: RegExp,
      description?: string
    ): (v: string) => TextDoesNotMatchRegExpValidationError[] {
      return (v) => (regExp.test(v) ? [] : [new TextDoesNotMatchRegExpValidationError(regExp, description)]);
    }

    public static hasMinimum(length: number): (v: string) => TextIsToShortValidationError[] {
      return (v) => (v.length < length ? [new TextIsToShortValidationError(length)] : []);
    }

    public static hasMaximum(length: number): (v: string) => TextIsToLongValidationError[] {
      return (v) => (v.length > length ? [new TextIsToLongValidationError(length)] : []);
    }
  }

  export class Number {
    public static isDifferentThan(excludedValue: number): (v: number) => NumberIsEqualToValidationError[] {
      return (v) => (v === excludedValue ? [new NumberIsEqualToValidationError(excludedValue)] : []);
    }

    public static isGreaterThan(
      min: number
    ): (v: number) => (NumberIsLowerThanValidationError | NumberIsEqualToValidationError)[] {
      return (v) => {
        if (v === min) {
          return [new NumberIsEqualToValidationError(min)];
        }
        return v < min ? [new NumberIsLowerThanValidationError(min)] : [];
      };
    }

    public static isLowerThan(
      max: number
    ): (v: number) => (NumberIsGreaterThanValidationError | NumberIsEqualToValidationError)[] {
      return (v) => {
        if (v === max) {
          return [new NumberIsEqualToValidationError(max)];
        }
        return v > max ? [new NumberIsGreaterThanValidationError(max)] : [];
      };
    }

    public static isEqualOrGreaterThan(min: number): (v: number) => NumberIsLowerThanValidationError[] {
      return (v) => (v < min ? [new NumberIsLowerThanValidationError(min)] : []);
    }

    public static isEqualOrLowerThan(max: number): (v: number) => NumberIsGreaterThanValidationError[] {
      return (v) => (v > max ? [new NumberIsGreaterThanValidationError(max)] : []);
    }
  }

  export class Array {
    public static hasMinimum<TItem>(length: number): (v: TItem[]) => ArrayIsToShortValidationError[] {
      return (v) => (v.length < length ? [new ArrayIsToShortValidationError(length)] : []);
    }

    public static hasMaximum<TItem>(length: number): (v: TItem[]) => ArrayIsToLongValidationError[] {
      return (v) => (v.length > length ? [new ArrayIsToLongValidationError(length)] : []);
    }
  }

  export function isRequired<TValue>(v: TValue): ValueIsRequiredValidationError[] {
    return !v ? [new ValueIsRequiredValidationError()] : [];
  }
}
