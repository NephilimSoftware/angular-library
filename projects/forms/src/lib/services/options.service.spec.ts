import {IOptionDirective} from '../directives/option.directive';
import {OptionAlreadyAddedError} from '../errors/option-already-added.error';
import {OptionsService} from './options.service';

describe('OptionsService', () => {
  let sut: OptionsService<string>;
  let januszOption: HTMLOptionElement;
  let januszDirective: IOptionDirective<string>;
  let furaOption: HTMLOptionElement;
  let furaDirective: IOptionDirective<string>;
  let gawendiOption: HTMLOptionElement;
  let gawendiDirective: IOptionDirective<string>;
  let secondFuraOption: HTMLOptionElement;
  let secondFuraDirective: IOptionDirective<string>;
  beforeEach(() => {
    sut = new OptionsService();
    januszOption = document.createElement('option');
    januszDirective = {
      value: 'Janusz',
    };
    furaOption = document.createElement('option');
    furaDirective = {
      value: 'Fura',
    };
    gawendiOption = document.createElement('option');
    gawendiDirective = {
      value: 'Gawendi',
    };
    secondFuraOption = document.createElement('option');
    secondFuraDirective = {
      ...furaDirective
    };
  });

  describe('getValue', () => {
    beforeEach(() => {
      sut.add(januszOption, januszDirective);
      sut.add(furaOption, furaDirective);
      sut.add(gawendiOption, gawendiDirective);
    });

    it('returns null when option was not added', () => {
      expect(sut.getValue(secondFuraOption)).toBeNull();
    });

    it('returns value of directive added with option', () => {
      expect(sut.getValue(furaOption)).toBe(furaDirective.value);
    });
  });

  describe('add', () => {
    beforeEach(() => {});

    it('adds directive for option', () => {
      expect(sut.getValue(gawendiOption)).toBeNull();
      sut.add(gawendiOption, gawendiDirective);
      expect(sut.getValue(gawendiOption)).toBe(gawendiDirective.value);
    });

    it('throws OptionAlreadyAddedError when option was added with other directive', () => {
      sut.add(gawendiOption, gawendiDirective);
      expect(() => sut.add(gawendiOption, januszOption)).toThrowMatching(OptionAlreadyAddedError.match);
    });

    it('throws OptionAlreadyAddedError when option was added with the same directive', () => {
      sut.add(gawendiOption, gawendiDirective);
      expect(() => sut.add(gawendiOption, gawendiDirective)).toThrowMatching(OptionAlreadyAddedError.match);
    });
  });

  describe('remove', () => {
    beforeEach(() => {
      sut.add(furaOption, furaDirective);
    });

    it('removes item from group', () => {
      expect(sut.getValue(furaOption)).toBe(furaDirective.value);
      sut.remove(furaOption);
      expect(sut.getValue(furaOption)).toBeNull();
    });
  });

  describe('ngOnDestroy', () => {
    it('clears all of the options', () => {
      sut.add(januszOption, januszDirective);
      sut.add(furaOption, furaDirective);
      sut.add(gawendiOption, gawendiDirective);

      sut.ngOnDestroy();

      expect(sut.getValue(januszOption)).toBeNull();
      expect(sut.getValue(furaOption)).toBeNull();
      expect(sut.getValue(gawendiOption)).toBeNull();
    });
  });
});
