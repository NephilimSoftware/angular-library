import {ElementRef} from '@angular/core';
import {createCallbackSpy} from '../model/callback.spec';
import {OptionsService} from '../services/options.service';
import {itBindsDirectiveTo} from './qa.spec';
import {SelectMultipleDirective} from './select-multiple.directive';

describe('SelectMultipleDirective', () => {
  let select: HTMLSelectElement;
  let sut: SelectMultipleDirective<string>;
  const options: string[] = ['Fura', 'Janusz', 'Gawendi'];

  beforeEach(() => {
    const optionsService: OptionsService<string> = new OptionsService<string>();
    select = document.createElement('select');
    select.setAttribute('multiple', '');
    options.forEach((value) => {
      const option: HTMLOptionElement = document.createElement('option');
      option.label = value;
      optionsService.add(option, {value});
      select.appendChild(option);
    });
    sut = new SelectMultipleDirective(optionsService, new ElementRef(select));
  });

  itBindsDirectiveTo(
    'select[formControl][multiple]',
    '<select [formControl]="formControl" multiple></select>',
    SelectMultipleDirective
  );

  describe('formControlValue', () => {
    it('sets value', () => {
      const expectedValue: string[] = [options[1], options[2]];
      sut.formControlValue = expectedValue;
      expect(sut.formControlValue).toEqual(expectedValue);
    });

    it('allows to set values that are not in options list', () => {
      const expectedValue: string[] = ['mock value'];
      sut.formControlValue = expectedValue;
      expect(sut.formControlValue).toEqual(expectedValue);
    });

    it('set value in the same order as it was set', () => {
      sut.formControlValue = [options[2], options[1], options[0]];
      expect(sut.formControlValue).toEqual([options[2], options[1], options[0]]);
    });

    it('allows to set empty array', () => {
      sut.formControlValue = [options[2], options[1], options[0]];
      sut.formControlValue = [];
      expect(sut.formControlValue).toEqual([]);
    });
  });

  describe('formControlValueChange', () => {
    it("doesn't dispatch callback on subscription", () => {
      const callback: (value: string) => void = createCallbackSpy<string>();
      sut.formControlValue = [options[1], options[2]];
      sut.formControlValueChange.subscribe(callback);
      expect(callback).not.toHaveBeenCalled();
    });

    it('dispatches when value was changed', () => {
      const callback: (value: string[]) => void = createCallbackSpy<string[]>();
      const expectedValue: string[] = [options[1], options[2]];
      sut.formControlValueChange.subscribe(callback);
      sut.formControlValue = expectedValue;
      expect(callback).toHaveBeenCalledWith(expectedValue);
    });

    it("dispatches when value was changed and doesn't change the value order", () => {
      const callback: (value: string[]) => void = createCallbackSpy<string[]>();
      sut.formControlValueChange.subscribe(callback);
      sut.formControlValue = [options[2], options[1]];
      expect(callback).toHaveBeenCalledWith([options[2], options[1]]);
    });

    it('dispatches with current value when input event was dispatched from input element', () => {
      const callback: (value: string[]) => void = createCallbackSpy<string[]>();
      sut.formControlValue = [];
      sut.formControlValueChange.subscribe(callback);
      select.options[1].selected = true;
      select.options[2].selected = true;
      select.dispatchEvent(new Event('input'));
      expect(callback).toHaveBeenCalledWith([options[1], options[2]]);
    });

    it("doesn't dispatch when new value is equal to previous", () => {
      const callback: (value: string[]) => void = createCallbackSpy<string[]>();
      const expectedValue: string[] = [options[1], options[2]];
      sut.formControlValue = expectedValue;
      sut.formControlValueChange.subscribe(callback);
      sut.formControlValue = expectedValue;
      expect(callback).not.toHaveBeenCalledWith(expectedValue);
    });

    it("doesn't dispatch value when value contains the same members", () => {
      const callback: (value: string[]) => void = createCallbackSpy<string[]>();
      sut.formControlValue = [options[1], options[2]];
      sut.formControlValueChange.subscribe(callback);
      sut.formControlValue = [options[2], options[1]];
      expect(callback).not.toHaveBeenCalled();
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
