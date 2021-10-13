import {keys} from './object';

describe('Object', () => {
  describe('keys', () => {
    it ('returns array of object keys', () => {
      const result: string[] = keys({
        text: 'simple text',
        zero: 0,
        bool: false,
        containingUndefined: undefined,
        containingNull: null
      });

      expect(result).toEqual([
        'text', 'zero', 'bool', 'containingUndefined', 'containingNull'
      ]);
    });

    it ('returns empty array when object is empty', () => {
      const result: string[] = keys({});

      expect(result).toEqual([]);
    });
  });
});
