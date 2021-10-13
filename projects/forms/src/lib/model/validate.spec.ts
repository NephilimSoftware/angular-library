import {Validate} from './validate';
import {
  ArrayIsToLongValidationError,
  ArrayIsToShortValidationError, NumberIsEqualToValidationError, NumberIsGreaterThanValidationError, NumberIsLowerThanValidationError,
  TextDoesNotMatchRegExpValidationError,
  TextIsNotAnEmailValidationError, TextIsToLongValidationError,
  TextIsToShortValidationError,
  ValueIsRequiredValidationError
} from './validation-errors';

describe('Validate', () => {
  describe('isRequired', () => {
    it ('returns ValueIsRequiredValidationError when falsy value is passed', () => {
      expect(Validate.isRequired(null)).toEqual([new ValueIsRequiredValidationError()]);
      expect(Validate.isRequired(undefined)).toEqual([new ValueIsRequiredValidationError()]);
      expect(Validate.isRequired(false)).toEqual([new ValueIsRequiredValidationError()]);
      expect(Validate.isRequired(0)).toEqual([new ValueIsRequiredValidationError()]);
      expect(Validate.isRequired('')).toEqual([new ValueIsRequiredValidationError()]);
    });

    it ('returns empty array when truthy value is passed', () => {
      expect(Validate.isRequired({})).toEqual([]);
      expect(Validate.isRequired([])).toEqual([]);
      expect(Validate.isRequired('Fura')).toEqual([]);
      expect(Validate.isRequired(true)).toEqual([]);
      expect(Validate.isRequired(-1)).toEqual([]);
      expect(Validate.isRequired(1)).toEqual([]);
    });
  });

  describe('Text', () => {
    describe('isAnEmail', () => {
      it ('returns an empty array when valid email is passed', () => {
        expect(Validate.Text.isAnEmail('fura@nephilim.software')).toEqual([]);
        expect(Validate.Text.isAnEmail('a@a')).toEqual([]);
      });

      it ('returns TextIsNotAnEmailValidationError when more than one email is passed', () => {
        expect(Validate.Text.isAnEmail('fura@nephilim.software;janusz@nephilim.software')).toEqual([new TextIsNotAnEmailValidationError()]);
        expect(Validate.Text.isAnEmail('fura@nephilim.software, janusz@nephilim.software')).toEqual([new TextIsNotAnEmailValidationError()]);
      });

      it ('returns TextIsNotAnEmailValidationError when invalid email is passed', () => {
        expect(Validate.Text.isAnEmail('fura')).toEqual([new TextIsNotAnEmailValidationError()]);
        expect(Validate.Text.isAnEmail('fura@')).toEqual([new TextIsNotAnEmailValidationError()]);
        expect(Validate.Text.isAnEmail('fura@ nephilim.software')).toEqual([new TextIsNotAnEmailValidationError()]);
        expect(Validate.Text.isAnEmail('@a')).toEqual([new TextIsNotAnEmailValidationError()]);
        expect(Validate.Text.isAnEmail('')).toEqual([new TextIsNotAnEmailValidationError()]);
      });
    });

    describe('matchesRegExp', () => {
      let sut: (v: string) => TextDoesNotMatchRegExpValidationError[];
      const regExp: RegExp = /^\d\d\d$/;
      const description: string = 'three digit number';

      beforeEach(() => {
        sut = Validate.Text.matchesRegExp(regExp, description);
      });

      it ('returns empty array when value matches regexp', () => {
        expect(sut('333')).toEqual([]);
        expect(sut('123')).toEqual([]);
      });

      it ('returns TextDoesNotMatchRegExpValidationError when value doesn\'t match regexp', () => {
        expect(sut('33')).toEqual([new TextDoesNotMatchRegExpValidationError(regExp, description)]);
        expect(sut('abc')).toEqual([new TextDoesNotMatchRegExpValidationError(regExp, description)]);
        expect(sut('1231')).toEqual([new TextDoesNotMatchRegExpValidationError(regExp, description)]);
      });
    });

    describe('hasMinimum', () => {
      let sut: (v: string) => TextIsToShortValidationError[];

      beforeEach(() => {
        sut = Validate.Text.hasMinimum(3);
      });

      it ('returns empty array when text length is equal to passed length', () => {
        expect(sut('333')).toEqual([]);
      });

      it ('returns empty array when text length is greater than passed length', () => {
        expect(sut('1234')).toEqual([]);
      });

      it ('returns TextIsToShortValidationError when text length is lower than passed length', () => {
        expect(sut('ab')).toEqual([new TextIsToShortValidationError(3)]);
        expect(sut('a')).toEqual([new TextIsToShortValidationError(3)]);
        expect(sut('')).toEqual([new TextIsToShortValidationError(3)]);
      });
    });

    describe('hasMaximum', () => {
      let sut: (v: string) => TextIsToLongValidationError[];

      beforeEach(() => {
        sut = Validate.Text.hasMaximum(3);
      });

      it ('returns empty array when text length is equal to passed length', () => {
        expect(sut('333')).toEqual([]);
      });

      it ('returns empty array when text length is lower than passed length', () => {
        expect(sut('12')).toEqual([]);
        expect(sut('1')).toEqual([]);
        expect(sut('')).toEqual([]);
      });

      it ('returns TextIsToLongValidationError when text length is greater than passed length', () => {
        expect(sut('abcd')).toEqual([new TextIsToLongValidationError(3)]);
      });
    });
  });

  describe('Number', () => {
    describe('isDifferentThan', () => {
      let sut: (v: number) => NumberIsEqualToValidationError[];

      beforeEach(() => {
        sut = Validate.Number.isDifferentThan(333);
      });

      it ('returns empty array when passed value is not equal to excludedValue', () => {
        expect(sut(12)).toEqual([]);
        expect(sut(334)).toEqual([]);
      });

      it ('returns NumberIsEqualToValidationError when passed value is equal to excludedValue', () => {
        expect(sut(333)).toEqual([new NumberIsEqualToValidationError(333)]);
      });
    });

    describe('isEqualOrLowerThan', () => {
      let sut: (v: number) => NumberIsGreaterThanValidationError[];

      beforeEach(() => {
        sut = Validate.Number.isEqualOrLowerThan(333);
      });

      it ('returns empty array when passed value is lower than max', () => {
        expect(sut(332)).toEqual([]);
      });

      it ('returns empty array when passed value is equal to max', () => {
        expect(sut(333)).toEqual([]);
      });

      it ('returns NumberIsGreaterThanValidationError when passed value is equal to excludedValue', () => {
        expect(sut(334)).toEqual([new NumberIsGreaterThanValidationError(333)]);
      });
    });

    describe('isEqualOrGreaterThan', () => {
      let sut: (v: number) => NumberIsLowerThanValidationError[];

      beforeEach(() => {
        sut = Validate.Number.isEqualOrGreaterThan(333);
      });

      it ('returns empty array when passed value is greater than max', () => {
        expect(sut(334)).toEqual([]);
      });

      it ('returns empty array when passed value is equal to max', () => {
        expect(sut(333)).toEqual([]);
      });

      it ('returns NumberIsLowerThanValidationError when passed value is equal to excludedValue', () => {
        expect(sut(332)).toEqual([new NumberIsLowerThanValidationError(333)]);
      });
    });

    describe('isLowerThan', () => {
      let sut: (v: number) => (NumberIsGreaterThanValidationError | NumberIsEqualToValidationError)[];

      beforeEach(() => {
        sut = Validate.Number.isLowerThan(333);
      });

      it ('returns empty array when passed value is lower than max', () => {
        expect(sut(332)).toEqual([]);
      });

      it ('returns NumberIsEqualToValidationError when passed value is equal to max', () => {
        expect(sut(333)).toEqual([new NumberIsEqualToValidationError(333)]);
      });

      it ('returns NumberIsGreaterThanValidationError when passed value is equal to excludedValue', () => {
        expect(sut(334)).toEqual([new NumberIsGreaterThanValidationError(333)]);
      });
    });

    describe('isGreaterThan', () => {
      let sut: (v: number) => (NumberIsLowerThanValidationError | NumberIsEqualToValidationError)[];

      beforeEach(() => {
        sut = Validate.Number.isGreaterThan(333);
      });

      it ('returns empty array when passed value is greater than max', () => {
        expect(sut(334)).toEqual([]);
      });

      it ('returns NumberIsEqualToValidationError when passed value is equal to max', () => {
        expect(sut(333)).toEqual([new NumberIsEqualToValidationError(333)]);
      });

      it ('returns NumberIsLowerThanValidationError when passed value is equal to excludedValue', () => {
        expect(sut(332)).toEqual([new NumberIsLowerThanValidationError(333)]);
      });
    });
  });

  describe('Array', () => {
    describe('hasMinimum', () => {
      let sut: (v: number[]) => ArrayIsToShortValidationError[];

      beforeEach(() => {
        sut = Validate.Array.hasMinimum(3);
      });

      it ('returns empty array when array length is equal to passed length', () => {
        expect(sut([3, 3, 3])).toEqual([]);
      });

      it ('returns empty array when text length is greater than passed length', () => {
        expect(sut([1, 2, 3, 4])).toEqual([]);
      });

      it ('returns TextIsToShortValidationError when text length is lower than passed length', () => {
        expect(sut([1, 2])).toEqual([new ArrayIsToShortValidationError(3)]);
        expect(sut([1])).toEqual([new ArrayIsToShortValidationError(3)]);
        expect(sut([])).toEqual([new ArrayIsToShortValidationError(3)]);
      });
    });

    describe('hasMaximum', () => {
      let sut: (v: number[]) => ArrayIsToLongValidationError[];

      beforeEach(() => {
        sut = Validate.Array.hasMaximum(3);
      });

      it ('returns empty array when text length is equal to passed length', () => {
        expect(sut([3, 3, 3])).toEqual([]);
      });

      it ('returns empty array when text length is lower than passed length', () => {
        expect(sut([1, 2])).toEqual([]);
        expect(sut([1])).toEqual([]);
        expect(sut([])).toEqual([]);
      });

      it ('returns TextIsToLongValidationError when text length is greater than passed length', () => {
        expect(sut([1, 2, 3, 4])).toEqual([new ArrayIsToLongValidationError(3)]);
      });
    });
  });
});
