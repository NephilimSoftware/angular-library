import {ElementRef} from '@angular/core';
import {createCallbackSpy} from '../model/callback.spec';
import {itBindsDirectiveTo} from './qa.spec';
import {TextareaDirective} from './textarea.directive';

describe('TextareaDirective', () => {
  let textarea: HTMLTextAreaElement;
  let sut: TextareaDirective;

  beforeEach(() => {
    textarea = document.createElement('textarea');
    sut = new TextareaDirective(new ElementRef(textarea));
  });

  itBindsDirectiveTo('textarea[formControl]', '<textarea [formControl]="formControl"></textarea>', TextareaDirective);

  describe('formControlValue', () => {
    it('sets value', () => {
      const expectedValue: string = 'mock value';
      sut.formControlValue = expectedValue;
      expect(sut.formControlValue).toEqual(expectedValue);
    });
  });

  describe('formControlValueChange', () => {
    it("doesn't dispatch callback on subscription", () => {
      const callback: (value: string) => void = createCallbackSpy<string>();
      sut.formControlValue = 'some value';
      sut.formControlValueChange.subscribe(callback);
      expect(callback).not.toHaveBeenCalled();
    });

    it('dispatches when value was changed', () => {
      const callback: (value: string) => void = createCallbackSpy<string>();
      const expectedValue: string = 'mock value';
      sut.formControlValue = expectedValue;
      expect(callback).not.toHaveBeenCalledWith(expectedValue);
    });

    it('dispatches with current value when input event was dispatched from input element', () => {
      const callback: (value: string) => void = createCallbackSpy<string>();
      const expectedValue: string = 'mock value';
      sut.formControlValue = expectedValue;
      sut.formControlValueChange.subscribe(callback);
      textarea.dispatchEvent(new Event('input'));
      expect(callback).toHaveBeenCalledWith(expectedValue);
    });

    it("doesn't dispatch when new value is equal to previous", () => {
      const callback: (value: string) => void = createCallbackSpy<string>();
      const expectedValue: string = 'mock value';
      sut.formControlValue = expectedValue;
      sut.formControlValueChange.subscribe(callback);
      sut.formControlValue = expectedValue;
      expect(callback).not.toHaveBeenCalledWith(expectedValue);
    });
  });

  describe('isDisabled', () => {
    it('disables / enables input', () => {
      sut.isDisabled = false;
      expect(textarea.disabled).toBeFalse();
      sut.isDisabled = true;
      expect(textarea.disabled).toBeTrue();
      sut.isDisabled = false;
      expect(textarea.disabled).toBeFalse();
    });
  });

  describe('touched', () => {
    it('is dispatched when input was focused', () => {
      const callback: (value: string) => void = createCallbackSpy<string>();
      sut.touched.subscribe(callback);
      textarea.dispatchEvent(new FocusEvent('focus'));
      expect(callback).toHaveBeenCalled();
    });
  });

  describe('ngOnDestroy', () => {
    it('stops listening for input event', () => {
      const callback: (value: string) => void = createCallbackSpy<string>();
      sut.formControlValueChange.subscribe(callback);
      sut.ngOnDestroy();
      textarea.dispatchEvent(new Event('input'));
      expect(callback).not.toHaveBeenCalled();
    });

    it('stops listening for focus event', () => {
      const callback: (value: string) => void = createCallbackSpy<string>();
      sut.touched.subscribe(callback);
      sut.ngOnDestroy();
      textarea.dispatchEvent(new FocusEvent('focus'));
      expect(callback).not.toHaveBeenCalled();
    });
  });
});
