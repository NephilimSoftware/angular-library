import {ElementRef} from '@angular/core';
import {createCallbackSpy} from '../model/callback.spec';
import {OptionsService} from '../services/options.service';
import {OptionDirective} from './option.directive';

describe('OptionDirective', () => {
  let optionsService: OptionsService<string>;
  let sut: OptionDirective<string>;
  let option: HTMLOptionElement;

  beforeEach(() => {
    optionsService = new OptionsService<string>();
    option = document.createElement('option');
    sut = new OptionDirective<string>(optionsService, new ElementRef(option));
    sut.value = 'Fura';
  });

  it ('it allows to create without optionsService (@Optional)', () => {
    expect(() => sut = new OptionDirective<string>(<any>undefined, new ElementRef(option))).not.toThrow();
    expect(() => sut.value = 'Janusz').not.toThrow();
    expect(sut.value).toBe('Janusz');
  });

  it('is registered in optionsService', () => {
    expect(optionsService.getValue(option)).toBe(sut.value);
  });

  describe('value', () => {
    it('dispatches optionsService.optionChanged event when value was changed', () => {
      const callback: Function = createCallbackSpy();
      optionsService.optionChanged.subscribe(callback);
      sut.value = 'Janusz';
      expect(callback).toHaveBeenCalledOnceWith(option);
    });

    it("doesn't dispatch optionsService.optionChanged event when value was not changed", () => {
      const callback: Function = createCallbackSpy();
      optionsService.optionChanged.subscribe(callback);
      sut.value = 'Fura';
      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('ngOnDestroy', () => {
    it('is unregistered from optionsService', () => {
      sut.ngOnDestroy();
      expect(optionsService.getValue(option)).toBeNull();
    });

    it('stops dispatching optionsService.optionChanged event when value was changed', () => {
      const callback: Function = createCallbackSpy();
      optionsService.optionChanged.subscribe(callback);
      sut.ngOnDestroy();
      sut.value = 'Janusz';
      expect(callback).not.toHaveBeenCalled();
    });
  });
});
