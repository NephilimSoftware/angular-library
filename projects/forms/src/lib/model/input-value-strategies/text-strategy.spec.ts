import {TextStrategy} from './text-strategy';

describe('TextStrategy', () => {
  let input: HTMLInputElement;
  let sut: TextStrategy;

  beforeEach(() => {
    input = document.createElement('input');

    sut = new TextStrategy();
  });

  describe('get', () => {
    it ('returns input value', () => {
      input.value = '333';
      expect(sut.get(input)).toBe('333');
      input.value = '';
      expect(sut.get(input)).toBe('');
    });
  });

  describe('set', () => {
    it ('sets input value', () => {
      sut.set(input, '333');
      expect(input.value).toBe('333');
      sut.set(input, '');
      expect(input.value).toBe('');
    });
  });

  describe('isEqual', () => {
    it ('returns true when values are equal', () => {
      expect(sut.isEqual('', '')).toBeTrue();
      expect(sut.isEqual('333', '333')).toBeTrue();
    });

    it ('returns false when values are equal', () => {
      expect(sut.isEqual('333', '')).toBeFalse();
      expect(sut.isEqual('', '333')).toBeFalse();
    });
  });

  describe('validate', () => {
    it("doesn't change value when it's a string", () => {
      expect(sut.validate('333')).toBe('333');
      expect(sut.validate('')).toBe('');
    });

    it('returns number converted to string when number is passed as parameter', () => {
      expect(sut.validate(333.333)).toBe('333.333');
    });

    it('returns converted to ISO date time string when Date is passed as parameter', () => {
      expect(sut.validate(new Date('29 Apr 1986 07:45:23 UTC'))).toBe('1986-04-29T07:45:23.000Z');
    });

    it('returns empty string when null is passed as value', () => {
      expect(sut.validate(null)).toBe('');
    });

    it('returns "on" when true is passes as value', () => {
      expect(sut.validate(true)).toBe('on');
    });

    it('returns empty string when false is passes as value', () => {
      expect(sut.validate(false)).toBe('');
    });
  });
});
