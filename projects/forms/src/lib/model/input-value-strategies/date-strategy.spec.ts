import {DateStrategy} from './date-strategy';

describe('DateStrategy', () => {
  let input: HTMLInputElement;
  let sut: DateStrategy;

  beforeEach(() => {
    input = document.createElement('input');
    input.type = 'date';

    sut = new DateStrategy();
  });

  describe('get', () => {
    it ('returns input valueAsDate', () => {
      const date: Date = new Date('29 Apr 1986 07:45:23 UTC');
      input.valueAsDate = date;
      const result: Date | null = sut.get(input);
      expect(result).not.toBeNull();
      expect(result?.getUTCDate()).toEqual(date.getUTCDate());
      expect(result?.getUTCMonth()).toEqual(date.getUTCMonth());
      expect(result?.getUTCFullYear()).toEqual(date.getUTCFullYear());
      input.valueAsDate = null;
      expect(sut.get(input)).toBeNull();
    });
  });

  describe('set', () => {
    it ('sets input valueAsDate', () => {
      const date: Date = new Date('29 Apr 1986 07:45:23 UTC');
      sut.set(input, date);
      const result: Date | null = input.valueAsDate;
      expect(result).not.toBeNull();
      expect(result?.getUTCDate()).toEqual(date.getUTCDate());
      expect(result?.getUTCMonth()).toEqual(date.getUTCMonth());
      expect(result?.getUTCFullYear()).toEqual(date.getUTCFullYear());
      sut.set(input, null);
      expect(input.valueAsDate).toBeNull();
    });
  });

  describe('isEqual', () => {
    it ('returns true when values are equal', () => {
      const date: Date = new Date('29 Apr 1986 07:45:23 UTC');
      expect(sut.isEqual(date, date)).toBeTrue();
      expect(sut.isEqual(new Date('29 Apr 1986 07:45:23 UTC'), new Date('29 Apr 1986 07:45:23 UTC'))).toBeTrue();
      expect(sut.isEqual(null, null)).toBeTrue();
    });

    it ('returns false when values are equal', () => {
      expect(sut.isEqual(new Date('29 Apr 1986 07:45:23 UTC'), new Date('29 Apr 1986 07:45:24 UTC'))).toBeFalse();
      expect(sut.isEqual(new Date('29 Apr 1986 07:45:23 UTC'), null)).toBeFalse();
      expect(sut.isEqual(null, new Date('29 Apr 1986 07:45:23 UTC'))).toBeFalse();
    });
  });

  describe('validate', () => {
    it("doesn't change value when it's a number", () => {
      const date: Date = new Date('29 Apr 1986 07:45:23 UTC');
      expect(sut.validate(date)).toBe(date);
    });

    it('returns Date when string date time string is passed', () => {
      const date: string = '29 Apr 1986 07:45:23 UTC';
      expect(sut.validate(date)).toEqual(new Date(date));
    });

    it('returns Date when ISO string is passed', () => {
      const date: string = '1986-04-29T07:45:23.000Z';
      expect(sut.validate(date)).toEqual(new Date(date));
    });

    it('returns date when timestamp is passed as parameter', () => {
      const date: Date = new Date('29 Apr 1986 07:45:23 UTC');
      expect(sut.validate(date.getTime())).toEqual(date);
    });

    it('returns date when timestamp is passed as parameter', () => {
      expect(sut.validate('some string')).toBeNull();
    });

    it('returns null when null is passed as value', () => {
      expect(sut.validate(null)).toBeNull();
    });

    it('returns null when true is passes as value', () => {
      expect(sut.validate(true)).toBeNull();
    });

    it('returns null when false is passes as value', () => {
      expect(sut.validate(false)).toBeNull();
    });
  });
});
