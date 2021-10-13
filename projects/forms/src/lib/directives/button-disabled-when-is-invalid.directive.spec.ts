import {ElementRef} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {FormControl} from '../model/form-control';
import {ValidationError} from '../model/validation-errors';
import {ButtonDisabledWhenIsInvalidDirective} from './button-disabled-when-is-invalid.directive';

describe('ButtonDisabledWhenIsInvalidDirective', () => {
  let button: HTMLButtonElement;
  let sut: ButtonDisabledWhenIsInvalidDirective;
  let form: FormControl<string>;
  let mockValidatorResult: Subject<ValidationError[]>;
  const mockValidator: (value: string) => Observable<ValidationError[]> = (value) => mockValidatorResult;

  beforeEach(() => {
    mockValidatorResult = new Subject<ValidationError[]>();
    form = new FormControl('');
    button = document.createElement('button');
    sut = new ButtonDisabledWhenIsInvalidDirective(new ElementRef(button));
  });

  describe('disabledWhenFormIsBusy', () => {
    it('sets button.disabled to true when form is disabled', () => {
      button.disabled = false;
      form.disable();
      sut.disabledWhenFormIsInvalid = form;

      expect(button.disabled).toBeTrue();
    });

    it('sets button.disabled to false when form is enabled', () => {
      button.disabled = true;
      sut.disabledWhenFormIsInvalid = form;

      expect(button.disabled).toBeFalse();
    });

    it('sets button.disabled to true when form was disabled after initialization', () => {
      sut.disabledWhenFormIsInvalid = form;
      form.disable();

      expect(button.disabled).toBeTrue();
    });

    it('sets button.disabled to false when form was enabled after initialization', () => {
      form.disable();
      sut.disabledWhenFormIsInvalid = form;
      form.enable();

      expect(button.disabled).toBeFalse();
    });

    it('sets button.disabled to true when form is validating', () => {
      form.validators.set([mockValidator]);
      sut.disabledWhenFormIsInvalid = form;

      expect(button.disabled).toBeTrue();
    });

    it('sets button.disabled to false when form is not validating', () => {
      form.validators.set([mockValidator]);
      mockValidatorResult.next([]);
      sut.disabledWhenFormIsInvalid = form;

      expect(button.disabled).toBeFalse();
    });

    it('sets button.disabled to false when form finished validating after initialization', () => {
      form.validators.set([mockValidator]);
      sut.disabledWhenFormIsInvalid = form;
      mockValidatorResult.next([]);

      expect(button.disabled).toBeFalse();
    });

    it('sets button.disabled to true when form.isInvalid is true', () => {
      form.validators.set([mockValidator]);
      sut.disabledWhenFormIsInvalid = form;
      mockValidatorResult.next([new ValidationError()]);

      expect(button.disabled).toBeTrue();
    });

    it('sets button.disabled to false when form.isInvalid is false', () => {
      form.validators.set([mockValidator]);
      mockValidatorResult.next([]);
      sut.disabledWhenFormIsInvalid = form;

      expect(button.disabled).toBeFalse();
    });

    it('sets button.disabled to true when form.isInvalid changes to true', () => {
      form.validators.set([mockValidator]);
      mockValidatorResult.next([]);
      sut.disabledWhenFormIsInvalid = form;
      mockValidatorResult.next([new ValidationError()]);

      expect(button.disabled).toBeTrue();
    });

    it('sets button.disabled to false when form.isInvalid changes to false', () => {
      form.validators.set([mockValidator]);
      mockValidatorResult.next([new ValidationError()]);
      sut.disabledWhenFormIsInvalid = form;
      mockValidatorResult.next([]);

      expect(button.disabled).toBeFalse();
    });

    it('stops listening for changes on old form when disabledWhenFormIsInvalid was changed', () => {
      sut.disabledWhenFormIsInvalid = form;
      sut.disabledWhenFormIsInvalid = new FormControl('');
      expect(button.disabled).toBeFalse();
      form.disable();
      expect(button.disabled).toBeFalse();
    });
  });

  describe('ngOnDestroy', () => {
    it('stops listening for changes on form', () => {
      sut.disabledWhenFormIsInvalid = form;
      sut.ngOnDestroy();
      expect(button.disabled).toBeFalse();
      form.disable();
      expect(button.disabled).toBeFalse();
    });
  });
});
