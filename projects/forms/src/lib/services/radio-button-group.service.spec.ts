import {IRadioButtonDirective} from '../directives/radio-button.directive';
import {RadioButtonAlreadyAddedError} from '../errors/radio-button-already-added.error';
import {RadioButtonGroupService} from './radio-button-group.service';

describe('RadioButtonGroupService', () => {
  let sut: RadioButtonGroupService<string>;
  let janusz: IRadioButtonDirective<string>;
  let fura: IRadioButtonDirective<string>;
  let gawendi: IRadioButtonDirective<string>;
  let secondFura: IRadioButtonDirective<string>;
  beforeEach(() => {
    sut = new RadioButtonGroupService();
    janusz = {
      isSelected: false,
      value: 'Janusz',
    };
    fura = {
      isSelected: false,
      value: 'Fura',
    };
    gawendi = {
      isSelected: false,
      value: 'Gawendi',
    };
    secondFura = {
      ...fura
    };
  });

  describe('getValue', () => {
    beforeEach(() => {
      sut.add('test', janusz);
      sut.add('test', fura);
      sut.add('test', gawendi);
    });

    it('returns null when group is empty', () => {
      expect(sut.getValue('mock')).toBeNull();
    });

    it('returns null when none of radioButtons is selected', () => {
      expect(sut.getValue('test')).toBeNull();
    });

    it('returns first value for group name which is isSelected', () => {
      janusz.isSelected = true;
      fura.isSelected = true;
      gawendi.isSelected = true;
      expect(sut.getValue('test')).toBe(janusz.value);
    });

  });

  describe('add', () => {
    beforeEach(() => {
      sut.add('test', janusz);
      sut.add('test', fura);
    });

    it('adds item from group', () => {
      gawendi.isSelected = true;
      expect(sut.getValue('test')).toBeNull();
      sut.add('test', gawendi);
      expect(sut.getValue('test')).toBe(gawendi.value);
    });

    it('throws RadioButtonAlreadyAdded when item was in other group', () => {
      sut.add('test', gawendi);
      expect(() => sut.add('test2', gawendi)).toThrowMatching(RadioButtonAlreadyAddedError.match);
    });

    it('throws RadioButtonAlreadyAdded when item was in the same group', () => {
      sut.add('test', gawendi);
      expect(() => sut.add('test', gawendi)).toThrowMatching(RadioButtonAlreadyAddedError.match);
    });
  });

  describe('remove', () => {
    beforeEach(() => {
      sut.add('test', janusz);
      sut.add('test', fura);
      sut.add('test', gawendi);
    });

    it('removes item from group', () => {
      gawendi.isSelected = true;
      expect(sut.getValue('test')).toBe(gawendi.value);
      sut.remove(gawendi);
      expect(sut.getValue('test')).toBeNull();
    });
  });

  describe('setValue', () => {
    beforeEach(() => {
      sut.add('test', janusz);
      sut.add('test', fura);
      sut.add('test', gawendi);
      sut.add('test', secondFura);
    });

    it("doesn't select value from other group item", () => {
      sut.setValue('mock', fura.value);
      expect(fura.isSelected).toBeFalse();
    });

    it('selects items with value equal to passed value', () => {
      sut.setValue('test', fura.value);
      expect(janusz.isSelected).toBeFalse();
      expect(gawendi.isSelected).toBeFalse();
      expect(fura.isSelected).toBeTrue();
      expect(secondFura.isSelected).toBeTrue();
      sut.setValue('test', janusz.value);
      expect(janusz.isSelected).toBeTrue();
      expect(gawendi.isSelected).toBeFalse();
      expect(fura.isSelected).toBeFalse();
      expect(secondFura.isSelected).toBeFalse();
    });
  });

  describe('ngOnDestroy', () => {
    it('clears all of the groups', () => {
      janusz.isSelected = true;
      fura.isSelected = true;
      gawendi.isSelected = true;
      sut.add('a', janusz);
      sut.add('b', fura);
      sut.add('c', gawendi);

      sut.ngOnDestroy();

      expect(sut.getValue('a')).toBeNull();
      expect(sut.getValue('b')).toBeNull();
      expect(sut.getValue('c')).toBeNull();
    });
  });
});
