import {ElementRef} from '@angular/core';
import {createCallbackSpy} from '../model/callback.spec';
import {RadioButtonGroupService} from '../services/radio-button-group.service';
import {InputRadioDirective} from './input-radio.directive';
import {itBindsDirectiveTo} from './qa.spec';

describe('InputRadioDirective', () => {
  let groupService: RadioButtonGroupService<string>;
  let first: HTMLInputElement;
  let second: HTMLInputElement;
  let third: HTMLInputElement;
  let firstDirective: InputRadioDirective<string>;
  let secondDirective: InputRadioDirective<string>;
  let thirdDirective: InputRadioDirective<string>;

  function createRadioButton(name: string): HTMLInputElement {
    const result: HTMLInputElement = document.createElement('input');
    result.type = 'radio';
    result.name = name;
    return result;
  }

  function createSut(input: HTMLInputElement, value: string): InputRadioDirective<string> {
    const result: InputRadioDirective<string> = new InputRadioDirective<string>(groupService, new ElementRef(input));
    result.name = input.name;
    result.value = value;
    result.ngOnInit();
    return result;
  }

  beforeEach(() => {
    groupService = new RadioButtonGroupService<string>();
    const form: HTMLFormElement = document.createElement('form');
    first = createRadioButton('nephilim');
    second = createRadioButton('nephilim');
    third = createRadioButton('nephilim');

    form.appendChild(first);
    form.appendChild(second);
    form.appendChild(third);

    firstDirective = createSut(first, 'Fura');
    secondDirective = createSut(second, 'Janusz');
    thirdDirective = createSut(third, 'Gawendi');
  });

  itBindsDirectiveTo(
    'input[formControl][type=radio]',
    '<input [formControl]="formControl" type="radio" value="" />',
    InputRadioDirective
  );

  describe('HtmlFormElement', () => {
    it('checking one checkbox unchecks rest', () => {
      second.checked = true;

      expect(first.checked).toBeFalse();
      expect(second.checked).toBeTrue();
      expect(third.checked).toBeFalse();

      third.checked = true;

      expect(first.checked).toBeFalse();
      expect(second.checked).toBeFalse();
      expect(third.checked).toBeTrue();

      third.checked = false;

      expect(first.checked).toBeFalse();
      expect(second.checked).toBeFalse();
      expect(third.checked).toBeFalse();
    });
  });

  describe('formControlValue', () => {
    it("selects input with value that's equal to passed value", () => {
      firstDirective.formControlValue = 'Janusz';
      expect(firstDirective.isSelected).toBeFalse();
      expect(secondDirective.isSelected).toBeTrue();
      expect(thirdDirective.isSelected).toBeFalse();
    });

    it('returns the same value for all directives in group', () => {
      const expectedValue: string | null = secondDirective.value;
      firstDirective.formControlValue = expectedValue;
      expect(firstDirective.formControlValue).toEqual(expectedValue);
      expect(secondDirective.formControlValue).toEqual(expectedValue);
      expect(thirdDirective.formControlValue).toEqual(expectedValue);
    });

    it('deselects all inputs when null is passed', () => {
      firstDirective.formControlValue = secondDirective.value;
      firstDirective.formControlValue = null;
      expect(firstDirective.isSelected).toBeFalse();
      expect(secondDirective.isSelected).toBeFalse();
      expect(thirdDirective.isSelected).toBeFalse();
    });

    it("deselects all inputs when value that doesn't match any value is passed", () => {
      firstDirective.formControlValue = secondDirective.value;
      firstDirective.formControlValue = 'Nephilim';
      expect(firstDirective.isSelected).toBeFalse();
      expect(secondDirective.isSelected).toBeFalse();
      expect(thirdDirective.isSelected).toBeFalse();
    });
  });

  describe('name', () => {
    it('changes formControlValue to null when changed to empty group name', () => {
      firstDirective.formControlValue = secondDirective.value;
      firstDirective.name = 'someEmptyGroupName';
      expect(firstDirective.formControlValue).toBeNull();
      expect(secondDirective.formControlValue).toBe(secondDirective.value);
    });

    it('changes formControlValue to null of rest of items when selected input name is changed', () => {
      firstDirective.formControlValue = firstDirective.value;
      firstDirective.name = 'someEmptyGroupName';
      expect(firstDirective.formControlValue).toBe(firstDirective.value);
      expect(secondDirective.formControlValue).toBeNull();
    });

    it('changes formControlValue of directive that were name was changed to existing group name', () => {
      firstDirective.formControlValue = firstDirective.value;
      firstDirective.name = 'someEmptyGroupName';
      secondDirective.name = firstDirective.name;
      expect(firstDirective.formControlValue).toBe(firstDirective.value);
      expect(secondDirective.formControlValue).toBe(firstDirective.value);
    });
  });

  describe('isDisabled', () => {
    it('sets disabled field of input', () => {
      firstDirective.isDisabled = true;
      expect(first.disabled).toBeTrue();
      firstDirective.isDisabled = false;
      expect(first.disabled).toBeFalse();
    });
  });

  describe('isSelected', () => {
    it('sets checked field of input', () => {
      firstDirective.isSelected = true;
      expect(first.checked).toBeTrue();
      firstDirective.isSelected = false;
      expect(first.checked).toBeFalse();
    });
  });

  describe('touched', () => {
    it("is doesn't dispatch on subscribed", () => {
      const callback: Function = createCallbackSpy();
      firstDirective.touched.subscribe(callback);
      expect(callback).not.toHaveBeenCalled();
    });

    it('is dispatched when input was focused', () => {
      const callback: Function = createCallbackSpy();
      firstDirective.touched.subscribe(callback);
      first.dispatchEvent(new FocusEvent('focus'));
      expect(callback).toHaveBeenCalledTimes(1);
    });
  });

  describe('formControlValueChange', () => {
    it("is doesn't dispatch on subscribed", () => {
      const callback: Function = createCallbackSpy();
      firstDirective.formControlValueChange.subscribe(callback);
      expect(callback).not.toHaveBeenCalled();
    });

    it('is dispatched when input was clicked', () => {
      const callback: Function = createCallbackSpy();
      firstDirective.formControlValueChange.subscribe(callback);
      first.click();
      expect(callback).toHaveBeenCalledOnceWith(firstDirective.value);
    });
  });

  describe('ngOnInit', () => {
    let radioButton: HTMLInputElement;
    let sut: InputRadioDirective<string>;
    beforeEach(() => {
      radioButton = createRadioButton('test');
      sut = new InputRadioDirective<string>(groupService, new ElementRef(radioButton));
      sut.name = radioButton.name;
      sut.value = 'Fura';
    });

    it('before executing formControlValue returns null', () => {
      sut.formControlValue = sut.value;
      expect(sut.formControlValue).toBeNull();
    });

    it('after executing formControlValue returns proper value', () => {
      sut.formControlValue = sut.value;
      sut.ngOnInit();
      expect(sut.formControlValue).toBe(sut.value);
    });
  });

  describe('ngOnDestroy', () => {
    it('stops dispatching callbacks', () => {
      const callback: Function = createCallbackSpy();
      firstDirective.formControlValueChange.subscribe(callback);
      firstDirective.touched.subscribe(callback);
      firstDirective.ngOnDestroy();
      first.dispatchEvent(new FocusEvent('focus'));
      first.click();
      expect(callback).not.toHaveBeenCalled();
    });

    it("doesn't change formControlValue if destroyed directive was not selected", () => {
      firstDirective.formControlValue = secondDirective.value;
      firstDirective.ngOnDestroy();
      expect(firstDirective.formControlValue).toBe(secondDirective.value);
    });

    it('changes formControlValue to null if destroyed directive was selected', () => {
      firstDirective.formControlValue = firstDirective.value;
      firstDirective.ngOnDestroy();
      expect(firstDirective.formControlValue).toBeNull();
    });
  });
});
