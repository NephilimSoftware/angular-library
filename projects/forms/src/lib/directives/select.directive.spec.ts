import {ElementRef} from '@angular/core';
import {createCallbackSpy} from '../model/callback.spec';
import {OptionsService} from '../services/options.service';
import {IOptionDirective} from './option.directive';
import {itBindsDirectiveTo} from './qa.spec';
import {SelectDirective} from './select.directive';

describe('SelectDirective', () => {
  let select: HTMLSelectElement;
  let sut: SelectDirective<string>;
  let optionsService: OptionsService<string>;
  const options: string[] = ['Fura', 'Janusz', 'Gawendi'];

  beforeEach(() => {
    optionsService = new OptionsService<string>();
    select = document.createElement('select');
    options.forEach((value) => {
      const option: HTMLOptionElement = document.createElement('option');
      option.label = value;
      optionsService.add(option, {value});
      select.appendChild(option);
    });

    sut = new SelectDirective(optionsService, new ElementRef(select));
  });

  itBindsDirectiveTo(
    'select[formControl]',
    '<select [formControl]="formControl"></select>',
    SelectDirective
  );

  describe('formControlValue', () => {
    it('sets value', () => {
      const expectedValue: string = options[1];
      sut.formControlValue = expectedValue;
      expect(sut.formControlValue).toEqual(expectedValue);
    });

    it('sets first value when value not existing in options is passed', () => {
      const value: string = 'mock value';
      expect(options.indexOf(value) === -1).toBeTrue();
      sut.formControlValue = value;
      expect(sut.formControlValue).toEqual(value);
    });

    describe('optionsService.optionChanged', () => {
      const initialValue: string = 'Nephilim';
      const updatedValue: string = 'Software';
      let option: HTMLOptionElement;
      let optionDirective: IOptionDirective<string>;

      beforeEach(() => {
        option = document.createElement('option');
        optionDirective = {value: initialValue};
        option.label = initialValue;
        optionsService.add(option, optionDirective);
        select.appendChild(option);
        sut.formControlValue = initialValue;
      });

      it("doesn't change formControlValue when selected option value was changed", () => {
        optionDirective.value = updatedValue;
        optionsService.optionChanged.emit(option);

        expect(sut.formControlValue).toBe(initialValue);
      });

      it("deselects option when new value doesn't match formControlValue", () => {
        expect(option.selected).toBeTrue();
        optionDirective.value = updatedValue;
        optionsService.optionChanged.emit(option);
        expect(option.selected).toBeFalse();
      });
    });
  });

  describe('formControlValueChange', () => {
    it("doesn't dispatch callback on subscription", () => {
      const callback: (value: string) => void = createCallbackSpy<string>();
      sut.formControlValue = options[1];
      sut.formControlValueChange.subscribe(callback);
      expect(callback).not.toHaveBeenCalled();
    });

    it('dispatches when value was changed', () => {
      const callback: (value: string) => void = createCallbackSpy<string>();
      const expectedValue: string = options[1];
      sut.formControlValueChange.subscribe(callback);
      sut.formControlValue = expectedValue;
      expect(callback).toHaveBeenCalledWith(expectedValue);
    });

    it('dispatches with current value when input event was dispatched from input element and value was changed', () => {
      const callback: (value: string) => void = createCallbackSpy<string>();
      sut.formControlValue = options[1];
      sut.formControlValueChange.subscribe(callback);
      select.options[2].selected = true;
      select.dispatchEvent(new Event('input'));
      expect(callback).toHaveBeenCalledWith(options[2]);
    });

    it("doesn't dispatch with current value when input event was dispatched from input element and value was not changed", () => {
      const callback: (value: string) => void = createCallbackSpy<string>();
      sut.formControlValue = options[1];
      sut.formControlValueChange.subscribe(callback);
      select.dispatchEvent(new Event('input'));
      expect(callback).not.toHaveBeenCalled();
    });

    it("doesn't dispatch when new value is equal to previous", () => {
      const callback: (value: string) => void = createCallbackSpy<string>();
      const expectedValue: string = options[1];
      sut.formControlValue = expectedValue;
      sut.formControlValueChange.subscribe(callback);
      sut.formControlValue = expectedValue;
      expect(callback).not.toHaveBeenCalledWith(expectedValue);
    });

    it("allows to set value that doesn't exist in options", () => {
      const callback: (value: string) => void = createCallbackSpy<string>();
      const value: string = 'mock value';
      expect(options.indexOf(value) === -1).toBeTrue();
      sut.formControlValue = options[1];
      sut.formControlValueChange.subscribe(callback);
      sut.formControlValue = value;
      expect(callback).toHaveBeenCalledWith(value);
    });
  });

  describe('isDisabled', () => {
    it('disables / enables input', () => {
      sut.isDisabled = false;
      expect(select.disabled).toBeFalse();
      sut.isDisabled = true;
      expect(select.disabled).toBeTrue();
      sut.isDisabled = false;
      expect(select.disabled).toBeFalse();
    });
  });

  describe('touched', () => {
    it('is dispatched when input was focused', () => {
      const callback: (value: string) => void = createCallbackSpy<string>();
      sut.touched.subscribe(callback);
      select.dispatchEvent(new FocusEvent('focus'));
      expect(callback).toHaveBeenCalled();
    });
  });

  describe('ngOnDestroy', () => {
    it('stops listening for input event', () => {
      const callback: (value: string) => void = createCallbackSpy<string>();
      sut.formControlValueChange.subscribe(callback);
      sut.ngOnDestroy();
      select.dispatchEvent(new Event('input'));
      expect(callback).not.toHaveBeenCalled();
    });

    it('stops listening for focus event', () => {
      const callback: (value: string) => void = createCallbackSpy<string>();
      sut.touched.subscribe(callback);
      sut.ngOnDestroy();
      select.dispatchEvent(new FocusEvent('focus'));
      expect(callback).not.toHaveBeenCalled();
    });
  });
});
