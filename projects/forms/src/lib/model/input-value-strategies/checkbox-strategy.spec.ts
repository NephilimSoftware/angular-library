import {CheckboxStrategy} from './checkbox-strategy';

describe('CheckboxStrategy', () => {
  let input: HTMLInputElement;
  let sut: CheckboxStrategy;

  beforeEach(() => {
    input = document.createElement('input');

    sut = new CheckboxStrategy();
  });

  describe('get', () => {
    it ('returns input checked value', () => {
      input.checked = true;
      expect(sut.get(input)).toBeTrue();
      input.checked = false;
      expect(sut.get(input)).toBeFalse();
    });
  });

  describe('set', () => {
    it ('sets input checked value', () => {
      sut.set(input, true);
      expect(input.checked).toBeTrue();
      sut.set(input, false);
      expect(input.checked).toBeFalse();
    });
  });

  describe('isEqual', () => {
    it ('returns true when values are equal', () => {
      expect(sut.isEqual(true, true)).toBeTrue();
      expect(sut.isEqual(false, false)).toBeTrue();
    });

    it ('returns false when values are equal', () => {
      expect(sut.isEqual(false, true)).toBeFalse();
      expect(sut.isEqual(true, false)).toBeFalse();
    });
  });

  describe('validate', () => {

    it("doesn't change value when it's a boolean", () => {
      expect(sut.validate(true)).toBeTrue();
      expect(sut.validate(false)).toBeFalse();
    });

    it('returns false when empty string was set as value', () => {
      expect(sut.validate('')).toBeFalse();
    });

    it('returns false when non empty string was set as value', () => {
      expect(sut.validate('0')).toBeTrue();
    });

    it('returns false when 0 was set as value', () => {
      expect(sut.validate(0)).toBeFalse();
    });

    it('returns true when positive number was set as value', () => {
      expect(sut.validate(333)).toBeTrue();
    });

    it('returns true when negative number was set as value', () => {
      expect(sut.validate(-333)).toBeTrue();
    });

    it('returns true when Date is passed as parameter', () => {
      expect(sut.validate(new Date(333))).toBeTrue();
    });

    it('returns false when null is passed as parameter', () => {
      expect(sut.validate(null)).toBeFalse();
    });
  });
});
