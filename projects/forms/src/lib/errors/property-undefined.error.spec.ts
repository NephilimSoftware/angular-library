import {PropertyUndefinedError} from './property-undefined.error';

describe('PropertyUndefinedError', () => {
  describe('match', () => {
    const propertyName: string = 'nephilim';
    const match: (value: Error) => boolean = PropertyUndefinedError.match(propertyName);

    it('returns false when passed error is not instance of PropertyUndefinedError', () => {
      expect(match(new Error())).toBeFalse();
    });

    it('returns false when passed PropertyUndefinedError has different propertyName', () => {
      expect(match(new PropertyUndefinedError('fura'))).toBeFalse();
    });

    it('returns true when passed PropertyUndefinedError has the same propertyName', () => {
      expect(match(new PropertyUndefinedError(propertyName))).toBeTrue();
    });
  });

  describe('assert', () => {
    it("doesn't throw error when value is null", () => {
      expect(() => PropertyUndefinedError.assert(null, 'property')).not.toThrow();
    });

    it("doesn't throw error when value is not undefined", () => {
      expect(() => PropertyUndefinedError.assert('simple text', 'property')).not.toThrow();
      expect(() => PropertyUndefinedError.assert(0, 'property')).not.toThrow();
      expect(() => PropertyUndefinedError.assert(false, 'property')).not.toThrow();
      expect(() => PropertyUndefinedError.assert('', 'property')).not.toThrow();
      expect(() => PropertyUndefinedError.assert([], 'property')).not.toThrow();
      expect(() => PropertyUndefinedError.assert({}, 'property')).not.toThrow();
    });

    it("throw PropertyUndefinedError when object doesn't contain property", () => {
      expect(() => PropertyUndefinedError.assert(undefined, 'property')).toThrowMatching(
        PropertyUndefinedError.match('property')
      );
    });
  });
});
