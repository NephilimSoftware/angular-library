import {ElementRef} from '@angular/core';
import {InputTypeNotSupportedError} from '../errors/input-type-not-supported.error';
import {createCallbackSpy} from '../model/callback.spec';
import {InputValue} from '../model/input-value';
import {InputDirective} from './input.directive';
import {itBindsDirectiveTo} from './qa.spec';

describe('InputDirective', () => {
  let input: HTMLInputElement;
  let sut: InputDirective;

  beforeEach(() => {
    input = document.createElement('input');
    sut = new InputDirective(new ElementRef(input));
  });

  itBindsDirectiveTo(
    'input[formControl]',
    '<input [formControl]="formControl" type="text" value="" />',
    InputDirective
  );

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
      input.dispatchEvent(new Event('input'));
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
      expect(input.disabled).toBeFalse();
      sut.isDisabled = true;
      expect(input.disabled).toBeTrue();
      sut.isDisabled = false;
      expect(input.disabled).toBeFalse();
    });
  });

  describe('touched', () => {
    it('is dispatched when input was focused', () => {
      const callback: (value: string) => void = createCallbackSpy<string>();
      sut.touched.subscribe(callback);
      input.dispatchEvent(new FocusEvent('focus'));
      expect(callback).toHaveBeenCalled();
    });
  });

  describe('ngOnDestroy', () => {
    it('stops listening for input event', () => {
      const callback: (value: string) => void = createCallbackSpy<string>();
      sut.formControlValueChange.subscribe(callback);
      sut.ngOnDestroy();
      input.dispatchEvent(new Event('input'));
      expect(callback).not.toHaveBeenCalled();
    });

    it('stops listening for focus event', () => {
      const callback: (value: string) => void = createCallbackSpy<string>();
      sut.touched.subscribe(callback);
      sut.ngOnDestroy();
      input.dispatchEvent(new FocusEvent('focus'));
      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('type', () => {
    it('is set to "text" by default', () => {
      expect(sut.type).toEqual('text');
    });

    it('changes input type to passed value', () => {
      sut.type = 'password';
      expect(input.type).toEqual('password');
    });

    describe('text', () => {
      beforeEach(() => {
        sut.type = 'text';
      });

      it("doesn't change value when it's a string", () => {
        const expectedValue: string = 'some text that can not be converted to other types';
        sut.formControlValue = expectedValue;
        expect(sut.formControlValue).toBe(expectedValue);
      });
    });

    describe('search', () => {
      beforeEach(() => {
        sut.type = 'text';
      });

      it("doesn't change value when it's a string", () => {
        const expectedValue: string = 'some text that can not be converted to other types';
        sut.formControlValue = expectedValue;
        expect(sut.formControlValue).toBe(expectedValue);
      });
    });

    describe('password', () => {
      beforeEach(() => {
        sut.type = 'password';
      });

      it("doesn't change value when it's a string", () => {
        const expectedValue: string = 'Ma15iKr37Ki';
        sut.formControlValue = expectedValue;
        expect(sut.formControlValue).toBe(expectedValue);
      });
    });

    describe('tel', () => {
      beforeEach(() => {
        sut.type = 'tel';
      });

      it("doesn't change value when it's a phone number", () => {
        const expectedValue: string = '666777888';
        sut.formControlValue = expectedValue;
        expect(sut.formControlValue).toBe(expectedValue);
      });

      it("doesn't change value when it's not a phone number", () => {
        const expectedValue: string = 'not a phone number';
        sut.formControlValue = expectedValue;
        expect(sut.formControlValue).toBe(expectedValue);
      });
    });

    describe('url', () => {
      beforeEach(() => {
        sut.type = 'url';
      });

      it("doesn't change value when it's an url", () => {
        const expectedValue: string = 'https://www.nephilim.software';
        sut.formControlValue = expectedValue;
        expect(sut.formControlValue).toBe(expectedValue);
      });

      it("doesn't change value when it's not an url", () => {
        const expectedValue: string = 'not an url';
        sut.formControlValue = expectedValue;
        expect(sut.formControlValue).toBe(expectedValue);
      });
    });

    describe('color', () => {
      beforeEach(() => {
        sut.type = 'color';
      });

      it('sets black color when short html code was passed', () => {
        sut.formControlValue = '#333';
        expect(sut.formControlValue).toBe('#000000');
      });

      it("doesn't change value when it's a full html color code", () => {
        const expectedValue: string = '#333333';
        sut.formControlValue = expectedValue;
        expect(sut.formControlValue).toBe(expectedValue);
      });

      it('sets black color when value that is not an color code is passed', () => {
        sut.formControlValue = 'not a html color code';
        expect(sut.formControlValue).toBe('#000000');
      });
    });

    describe('email', () => {
      beforeEach(() => {
        sut.type = 'email';
      });

      it('fura@nephilim.software', () => {
        const expectedValue: string = 'fura@nephilim.software';
        sut.formControlValue = expectedValue;
        expect(sut.formControlValue).toBe(expectedValue);
      });
    });

    describe('number', () => {
      beforeEach(() => {
        sut.type = 'number';
      });

      it("doesn't change value when it's a number", () => {
        sut.formControlValue = 333;
        expect(sut.formControlValue).toBe(333);
      });
    });

    describe('checkbox', () => {
      beforeEach(() => {
        sut.type = 'checkbox';
      });

      it("doesn't change value when it's a boolean", () => {
        sut.formControlValue = true;
        expect(sut.formControlValue).toBeTrue();
        sut.formControlValue = false;
        expect(sut.formControlValue).toBeFalse();
      });
    });

    describe('datetime-local', () => {
      beforeEach(() => {
        sut.type = 'datetime-local';
      });

      it("doesn't change day, month and year, hours, minutes of passed date and uses local time", () => {
        const date: Date = new Date('29 Apr 1986 07:45:23');
        sut.formControlValue = date;
        const result: Date = sut.formControlValue;
        expect(result.getDate()).toBe(date.getDate());
        expect(result.getMonth()).toBe(date.getMonth());
        expect(result.getFullYear()).toBe(date.getFullYear());
        expect(result.getHours()).toBe(date.getHours());
        expect(result.getMinutes()).toBe(date.getMinutes());
      });

      it('allows to set null', () => {
        sut.formControlValue = null;
        expect(sut.formControlValue).toBeNull();
      });
    });

    describe('month', () => {
      beforeEach(() => {
        sut.type = 'month';
      });

      it("doesn't change month and year of passed date", () => {
        const date: Date = new Date('29 Apr 1986 07:45:23 UTC');
        sut.formControlValue = date;
        const result: Date = sut.formControlValue;
        expect(result.getUTCMonth()).toBe(date.getUTCMonth());
        expect(result.getUTCFullYear()).toBe(date.getUTCFullYear());
      });

      it('allows to set null', () => {
        sut.formControlValue = null;
        expect(sut.formControlValue).toBeNull();
      });
    });

    describe('date', () => {
      beforeEach(() => {
        sut.type = 'date';
      });

      it("doesn't change day, month and year of passed date", () => {
        const date: Date = new Date('29 Apr 1986 07:45:23 UTC');
        sut.formControlValue = date;
        const result: Date = sut.formControlValue;
        expect(result.getUTCDate()).toBe(date.getUTCDate());
        expect(result.getUTCMonth()).toBe(date.getUTCMonth());
        expect(result.getUTCFullYear()).toBe(date.getUTCFullYear());
      });

      it('allows to set null', () => {
        sut.formControlValue = null;
        expect(sut.formControlValue).toBeNull();
      });
    });

    describe('month', () => {
      beforeEach(() => {
        sut.type = 'month';
      });

      it("doesn't change month and year of passed date", () => {
        const date: Date = new Date('29 Apr 1986 07:45:23 UTC');
        sut.formControlValue = date;
        const result: Date = sut.formControlValue;
        expect(result.getUTCMonth()).toBe(date.getUTCMonth());
        expect(result.getUTCFullYear()).toBe(date.getUTCFullYear());
      });

      it('allows to set null', () => {
        sut.formControlValue = null;
        expect(sut.formControlValue).toBeNull();
      });
    });

    describe('week', () => {
      beforeEach(() => {
        sut.type = 'week';
      });

      it("doesn't change month and year of passed date", () => {
        const date: Date = new Date('29 Apr 1986 07:45:23 UTC');
        sut.formControlValue = date;
        const result: Date = sut.formControlValue;
        expect(result.getUTCMonth()).toBe(date.getUTCMonth());
        expect(result.getUTCFullYear()).toBe(date.getUTCFullYear());
      });

      it('allows to set null', () => {
        sut.formControlValue = null;
        expect(sut.formControlValue).toBeNull();
      });
    });

    describe('time', () => {
      beforeEach(() => {
        sut.type = 'time';
      });

      it("doesn't change hours, minutes and year of passed date", () => {
        const date: Date = new Date('29 Apr 1986 07:45:23 UTC');
        sut.formControlValue = date;
        const result: Date = sut.formControlValue;
        expect(result.getUTCMinutes()).toBe(date.getUTCMinutes());
        expect(result.getUTCHours()).toBe(date.getUTCHours());
      });

      it('allows to set null', () => {
        sut.formControlValue = null;
        expect(sut.formControlValue).toBeNull();
      });
    });

    describe('file', () => {
      beforeEach(() => {
        sut.type = 'file';
      });

      it("doesn't change FileList passed as value", () => {
        const dataTransfer: DataTransfer = new DataTransfer();
        dataTransfer.items.add(new File([], 'file.csv'));
        dataTransfer.items.add(new File([], 'test.txt'));
        const expectedResult: FileList = dataTransfer.files;
        sut.formControlValue = expectedResult;
        expect(sut.formControlValue).toBe(expectedResult);
      });

      it('changes null to empty file list', () => {
        sut.formControlValue = <InputValue>null;
        const result: FileList = <FileList>sut.formControlValue;
        expect(result).not.toBeNull();
        expect(result.length).toBe(0);
      });
    });

    describe('range', () => {
      const min: number = -1000;
      const max: number = 1000;
      beforeEach(() => {
        sut.type = 'range';
        input.min = min.toString();
        input.max = max.toString();
      });

      it("doesn't change value when it's a number", () => {
        sut.formControlValue = 333;
        expect(sut.formControlValue).toBe(333);
      });

      it('changes value to min if passed one is lower than min', () => {
        sut.formControlValue = min - 1;
        expect(sut.formControlValue).toBe(min);
      });

      it('changes value to max if passed one is greater than max', () => {
        sut.formControlValue = max + 1;
        expect(sut.formControlValue).toBe(max);
      });
    });

    describe('button', () => {
      it('throws InputTypeNotSupportedError', () => {
        expect(() => (sut.type = 'button')).toThrowMatching(InputTypeNotSupportedError.match);
      });
    });

    describe('hidden', () => {
      it('throws InputTypeNotSupportedError', () => {
        expect(() => (sut.type = 'hidden')).toThrowMatching(InputTypeNotSupportedError.match);
      });
    });

    describe('reset', () => {
      it('throws InputTypeNotSupportedError', () => {
        expect(() => (sut.type = 'reset')).toThrowMatching(InputTypeNotSupportedError.match);
      });
    });

    describe('submit', () => {
      it('throws InputTypeNotSupportedError', () => {
        expect(() => (sut.type = 'submit')).toThrowMatching(InputTypeNotSupportedError.match);
      });
    });

    describe('image', () => {
      it('throws InputTypeNotSupportedError', () => {
        expect(() => (sut.type = 'image')).toThrowMatching(InputTypeNotSupportedError.match);
      });
    });
  });
});
