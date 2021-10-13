import {hasTheSameItems, isEqual} from './array';

describe('Array', () => {
  describe('isEqual', () => {
    function caseInsensitiveCompare(a: string, b: string): boolean {
      return a.toLowerCase() === b.toLowerCase();
    }

    it('returns true when arrays are the same', () => {
      expect(isEqual(['Fura', 'Janusz', 'Gawendi'], ['Fura', 'Janusz', 'Gawendi'])).toBeTrue();
      expect(isEqual([], [])).toBeTrue();
    });

    it("returns false when arrays aren't the same", () => {
      expect(isEqual(['Fura', 'Janusz', 'Gawendi'], ['Fura', 'Gawendi', 'Janusz'])).toBeFalse();
      expect(isEqual(['FURA', 'Janusz', 'Gawendi'], ['Fura', 'Janusz', 'Gawendi'])).toBeFalse();
      expect(isEqual(['FURA', 'Janusz'], ['Fura', 'Janusz', 'Gawendi'])).toBeFalse();
      expect(isEqual(['Fura'], [])).toBeFalse();
    });

    it('returns true when predicate returns true for all values on corresponding indexes', () => {
      expect(isEqual(['FURA', 'Janusz', 'Gawendi'], ['Fura', 'Janusz', 'Gawendi'], caseInsensitiveCompare)).toBeTrue();
    });

    it("returns false when predicate doesn't return true for all values on corresponding indexes", () => {
      expect(isEqual(['FURA', 'Janusz', 'Gawendi'], ['Fura', 'Gawendi', 'Janusz'], caseInsensitiveCompare)).toBeFalse();
    });
  });

  describe('hasTheSameItems', () => {
    function caseInsensitiveCompare(a: string, b: string): boolean {
      return a.toLowerCase() === b.toLowerCase();
    }

    it('returns true when contains the same items', () => {
      expect(hasTheSameItems(['Fura', 'Janusz', 'Gawendi'], ['Fura', 'Janusz', 'Gawendi'])).toBeTrue();
      expect(hasTheSameItems(['Fura', 'Gawendi', 'Janusz'], ['Fura', 'Janusz', 'Gawendi'])).toBeTrue();
      expect(
        hasTheSameItems(['Fura', 'Gawendi', 'Gawendi', 'Janusz'], ['Gawendi', 'Fura', 'Janusz', 'Gawendi'])
      ).toBeTrue();
      expect(hasTheSameItems([], [])).toBeTrue();
    });

    it("returns false when arrays doesn't contain the same items", () => {
      expect(
        hasTheSameItems(['Fura', 'Janusz', 'Gawendi', 'Gawendi'], ['Fura', 'Janusz', 'Janusz', 'Gawendi'])
      ).toBeFalse();
      expect(hasTheSameItems(['FURA', 'Janusz', 'Gawendi'], ['Fura', 'Janusz', 'Gawendi'])).toBeFalse();
      expect(hasTheSameItems(['FURA', 'Janusz'], ['Fura', 'Janusz', 'Gawendi'])).toBeFalse();
      expect(hasTheSameItems(['Fura'], [])).toBeFalse();
    });

    it('returns true when predicate returns true for pairs of values that are in the arrays', () => {
      expect(hasTheSameItems(['FURA', 'Janusz', 'Gawendi'], ['Fura', 'Janusz', 'Gawendi'], caseInsensitiveCompare)).toBeTrue();
      expect(hasTheSameItems(['FURA', 'fura', 'Janusz', 'Gawendi'], ['Fura', 'Janusz', 'Gawendi', 'fURA'], caseInsensitiveCompare)).toBeTrue();
    });

    it("returns false when predicate doesn't return true for pairs of values that are in the arrays", () => {
      expect(hasTheSameItems(['FURA', 'Janusz', 'Gawendi', 'Gawendi'], ['Fura', 'Gawendi', 'Janusz', 'JANUSZ'], caseInsensitiveCompare)).toBeFalse();
    });
  });
});
