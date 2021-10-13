import {valueEquals} from './value-equals';

describe('valueEquals', () => {
  class ParentClass {
    constructor(public readonly name: string) {}
  }
  class ChildClass extends ParentClass {}

  it('returns true if both parameters are true', () => {
    expect(valueEquals(true, true)).toBe(true);
  });
  it('returns true if both parameters are false', () => {
    expect(valueEquals(false, false)).toBe(true);
  });
  it('returns true if both parameters are the same string', () => {
    expect(valueEquals('test', 'test')).toBe(true);
  });
  it('returns true if both parameters are 0', () => {
    expect(valueEquals(0, 0)).toBe(true);
  });
  it('returns true if both parameters are the same number', () => {
    expect(valueEquals(333, 333)).toBe(true);
  });
  it('returns true if both parameters are null', () => {
    expect(valueEquals(null, null)).toBe(true);
  });
  it('returns true if both parameters are undefined', () => {
    expect(valueEquals(undefined, undefined)).toBe(true);
  });
  it('returns true if null and undefined is passed as parameter', () => {
    expect(valueEquals(undefined, null)).toBe(true);
    expect(valueEquals(null, undefined)).toBe(true);
  });

  it('returns true if passed complex object have the same structure', () => {
    expect(
      valueEquals(
        {
          first: 'some value',
          second: true,
          third: 333,
          fourth: {
            a: 'A',
            b: 2,
            c: false,
          },
          fifth: [1, 2, 3],
        },
        {
          first: 'some value',
          second: true,
          third: 333,
          fourth: {
            a: 'A',
            b: 2,
            c: false,
          },
          fifth: [1, 2, 3],
        }
      )
    ).toBe(true);
  });

  it('returns true if both arrays are empty', () => {
    expect(valueEquals([], [])).toBe(true);
  });

  it('returns true if passed array have the same numbers', () => {
    expect(valueEquals([1, 2, 5, 8, 4], [1, 2, 5, 8, 4])).toBe(true);
  });

  it('returns true if passed array have the same strings', () => {
    expect(valueEquals(['a', 'b', 'e', 'h', 'd'], ['a', 'b', 'e', 'h', 'd'])).toBe(true);
  });

  it('returns true if passed array have the same complex object', () => {
    expect(
      valueEquals(
        [
          {a: 'a', b: {c: 'c'}},
          {a: 'a', b: {c: 'd'}},
        ],
        [
          {a: 'a', b: {c: 'c'}},
          {a: 'a', b: {c: 'd'}},
        ]
      )
    ).toBe(true);
  });

  it('returns true if passed array have the same booleans', () => {
    expect(valueEquals([true, true, false, true, false], [true, true, false, true, false])).toBe(true);
  });

  it('returns false if passed array have different numbers', () => {
    expect(valueEquals([1, 2, 4, 5, 8], [1, 2, 5, 8, 4])).toBe(false);
  });

  it('returns false if passed array have different strings', () => {
    expect(valueEquals(['a', 'b', 'd', 'e', 'h'], ['a', 'b', 'e', 'h', 'd'])).toBe(false);
  });

  it('returns false if passed array have different booleans', () => {
    expect(valueEquals([true, true, true, false, false], [true, true, false, true, false])).toBe(false);
  });

  it('returns false if passed array have different complex objects', () => {
    expect(
      valueEquals(
        [
          {a: 'a', b: {c: 'c'}},
          {a: 'a', b: {c: 'd'}},
        ],
        [
          {a: 'a', b: {c: 'c'}},
          {a: 'a', b: {c: 'c'}},
        ]
      )
    ).toBe(false);
  });

  it('returns false if one of passed array is empty and second not', () => {
    expect(
      valueEquals(
        [],
        [
          {a: 'a', b: {c: 'c'}},
          {a: 'a', b: {c: 'c'}},
        ]
      )
    ).toBe(false, 'first parameter is empty array');
    expect(
      valueEquals(
        [
          {a: 'a', b: {c: 'c'}},
          {a: 'a', b: {c: 'c'}},
        ],
        []
      )
    ).toBe(false, 'second parameter is empty array');
  });

  it("returns false if parameters aren't the same booleans", () => {
    expect(valueEquals(true, false)).toBe(false);
    expect(valueEquals(false, true)).toBe(false);
  });
  it("returns false if parameters aren't the same strings", () => {
    expect(valueEquals('test', 'abc')).toBe(false);
  });
  it("returns false if parameters aren't the same numbers", () => {
    expect(valueEquals(0, 1)).toBe(false);
    expect(valueEquals(333, 123)).toBe(false);
  });
  it('returns false if one parameters is falsy and second is null', () => {
    expect(valueEquals(0, null)).toBe(false, 'for value: 0');
    expect(valueEquals(false, null)).toBe(false, 'for value: false');
    expect(valueEquals('', null)).toBe(false, 'for value: ""');
    expect(valueEquals([], null)).toBe(false, 'for value: []');
  });
  it('returns false if one parameters is falsy and second is undefined', () => {
    expect(valueEquals(0, undefined)).toBe(false, 'for value: 0');
    expect(valueEquals(false, undefined)).toBe(false, 'for value: false');
    expect(valueEquals('', undefined)).toBe(false, 'for value: ""');
    expect(valueEquals([], undefined)).toBe(false, 'for value: []');
  });
  it("returns false if classes doesn't match", () => {
    expect(valueEquals(new ChildClass('Fura'), new ParentClass('Fura'))).toBeFalse();
    expect(valueEquals(new ParentClass('Fura'), new ChildClass('Fura'))).toBeFalse();
  });
  it("returns true if both parameters are the same class with the same values", () => {
    expect(valueEquals(new ParentClass('Fura'), new ParentClass('Fura'))).toBeTrue();
    expect(valueEquals(new ChildClass('Fura'), new ChildClass('Fura'))).toBeTrue();
  });
});
