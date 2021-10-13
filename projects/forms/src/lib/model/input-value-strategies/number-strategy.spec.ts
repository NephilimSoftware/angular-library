import {NumberStrategy} from './number-strategy';

describe('NumberStrategy', () => {
  let input: HTMLInputElement;
  let sut: NumberStrategy;

  beforeEach(() => {
    input = document.createElement('input');
    input.type = 'number';

    sut = new NumberStrategy();
  });

  describe('get', () => {
    it ('returns input valueAsNumber', () => {
      input.valueAsNumber = 333;
      expect(sut.get(input)).toBe(333);
      input.valueAsNumber = 0;
      expect(sut.get(input)).toBe(0);
    });
  });

  describe('set', () => {
    it ('sets input valueAsNumber', () => {
      sut.set(input, 333);
      expect(input.valueAsNumber).toBe(333);
      sut.set(input, 0);
      expect(input.valueAsNumber).toBe(0);
    });
  });

  describe('isEqual', () => {
    it ('returns true when values are equal', () => {
      expect(sut.isEqual(333, 333.0000)).toBeTrue();
      expect(sut.isEqual(0xFF, 255)).toBeTrue();
      expect(sut.isEqual(-1, -1)).toBeTrue();
    });

    it ('returns false when values are equal', () => {
      expect(sut.isEqual(0, 333)).toBeFalse();
      expect(sut.isEqual(-1, 0)).toBeFalse();
    });
  });

  describe('validate', () => {
    it("doesn't change value when it's a number", () => {
      expect(sut.validate(333)).toBe(333);
      expect(sut.validate(0)).toBe(0);
      expect(sut.validate(-333)).toBe(-333);
    });

    it('returns number when string contains valid number', () => {
      expect(sut.validate('333.333')).toBe(333.333);
      expect(sut.validate('-333')).toBe(-333);
      expect(sut.validate('0')).toBe(0);
      expect(sut.validate('-0.333')).toBe(-0.333);
    });

    it('returns timestamp when Date is passed as parameter', () => {
      const date: Date = new Date('29 Apr 1986 07:45:23 UTC');
      expect(sut.validate(date)).toBe(date.getTime());
    });

    it('returns 0 when null is passed as value', () => {
      expect(sut.validate(null)).toBe(0);
    });

    it('returns 1 when true is passes as value', () => {
      expect(sut.validate(true)).toBe(1);
    });

    it('returns 0 when false is passes as value', () => {
      expect(sut.validate(false)).toBe(0);
    });
  });
});
