import {
  ArrayIsToLongValidationError,
  ArrayIsToShortValidationError,
  ChildValidationError,
  NumberIsEqualToValidationError,
  NumberIsGreaterThanValidationError,
  NumberIsLowerThanValidationError,
  TextDoesNotMatchRegExpValidationError,
  TextIsNotAnEmailValidationError,
  TextIsToLongValidationError,
  TextIsToShortValidationError,
  ValidationError,
  ValueIsRequiredValidationError,
} from './validation-errors';

export function qualityCheckValidationError(createSut: () => ValidationError): void {
  let sut: ValidationError;

  beforeEach(() => {
    sut = createSut();
  });

  describe('isEqual', () => {
    it('returns false when instance of base ValidationError is passed', () => {
      expect(sut.isEqual(new ValidationError())).toBeFalse();
    });
  });

  describe('toString', () => {
    it("doesn't return empty string", () => {
      expect(sut.toString()).not.toBe('');
    });
  });
}

describe('ValidationError', () => {
  qualityCheckValidationError(() => new ValidationError());
});

describe('ValueIsRequiredValidationError', () => {
  qualityCheckValidationError(() => new ValueIsRequiredValidationError());
});

describe('ChildValidationError', () => {
  qualityCheckValidationError(() => new ChildValidationError('test', new ValidationError()));
});

describe('TextIsNotAnEmailValidationError', () => {
  qualityCheckValidationError(() => new TextIsNotAnEmailValidationError());
});

describe('TextDoesNotMatchRegExpValidationError', () => {
  describe('when description is defined', () => {
    qualityCheckValidationError(() => new TextDoesNotMatchRegExpValidationError(/^\d\d\d$/, 'three digit number'));
  });
  describe('when description is not defined', () => {
    qualityCheckValidationError(() => new TextDoesNotMatchRegExpValidationError(/^abc$/));
  });
});

describe('TextIsToLongValidationError', () => {
  qualityCheckValidationError(() => new TextIsToLongValidationError(333));
});

describe('TextIsToShortValidationError', () => {
  qualityCheckValidationError(() => new TextIsToShortValidationError(333));
});

describe('ArrayIsToLongValidationError', () => {
  qualityCheckValidationError(() => new ArrayIsToLongValidationError(333));
});

describe('ArrayIsToShortValidationError', () => {
  qualityCheckValidationError(() => new ArrayIsToShortValidationError(333));
});

describe('NumberIsEqualToValidationError', () => {
  qualityCheckValidationError(() => new NumberIsEqualToValidationError(333));
});

describe('NumberIsGreaterThanValidationError', () => {
  qualityCheckValidationError(() => new NumberIsGreaterThanValidationError(333));
});

describe('NumberIsLowerThanValidationError', () => {
  qualityCheckValidationError(() => new NumberIsLowerThanValidationError(333));
});
