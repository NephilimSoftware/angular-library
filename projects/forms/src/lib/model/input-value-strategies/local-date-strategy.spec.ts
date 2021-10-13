import {toDateTimeLocal} from '../date';
import {LocalDateStrategy} from './local-date-strategy';

describe('LocalDateStrategy', () => {
  let input: HTMLInputElement;
  let sut: LocalDateStrategy;

  beforeEach(() => {
    input = document.createElement('input');
    input.type = 'datetime-local';

    sut = new LocalDateStrategy();
  });

  describe('get', () => {
    it('returns input value date in local time', () => {
      const date: Date = new Date('29 Apr 1986 07:45');
      input.value = toDateTimeLocal(date);
      const result: Date | null = sut.get(input);
      expect(result).not.toBeNull();
      expect(result?.getDate()).toEqual(date.getDate());
      expect(result?.getMonth()).toEqual(date.getMonth());
      expect(result?.getFullYear()).toEqual(date.getFullYear());
      input.value = toDateTimeLocal(null);
      expect(sut.get(input)).toBeNull();
    });
  });

  describe('set', () => {
    it('sets input value', () => {
      const date: Date = new Date('29 Apr 1986 07:45');
      sut.set(input, date);
      const result: string = input.value;
      expect(result).toBe(toDateTimeLocal(date));
      sut.set(input, null);
      expect(input.value).toBe('');
    });
  });

  describe('isEqual', () => {
    it('returns true when values are equal', () => {
      const date: Date = new Date('29 Apr 1986 07:45');
      expect(sut.isEqual(date, date)).toBeTrue();
      expect(sut.isEqual(new Date('29 Apr 1986 07:45'), new Date('29 Apr 1986 07:45'))).toBeTrue();
      expect(sut.isEqual(null, null)).toBeTrue();
    });

    it('returns false when values are equal', () => {
      expect(sut.isEqual(new Date('29 Apr 1986 07:45'), new Date('29 Apr 1986 07:46'))).toBeFalse();
      expect(sut.isEqual(new Date('29 Apr 1986 07:45'), null)).toBeFalse();
      expect(sut.isEqual(null, new Date('29 Apr 1986 07:45'))).toBeFalse();
    });
  });

  describe('validate', () => {
    it("doesn't change value when it's a number", () => {
      const date: Date = new Date('29 Apr 1986 07:45');
      expect(sut.validate(date)).toBe(date);
    });

    it('returns Date when string date time string is passed', () => {
      const date: string = '29 Apr 1986 07:45';
      expect(sut.validate(date)).toEqual(new Date(date));
    });

    it('returns Date when ISO string is passed', () => {
      const expectedResult: Date = new Date('29 Apr 1986 07:45');
      const date: string = toDateTimeLocal(expectedResult);
      expect(sut.validate(date)).toEqual(expectedResult);
    });

    it('returns date when timestamp is passed as parameter', () => {
      const date: Date = new Date('29 Apr 1986 07:45');
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
