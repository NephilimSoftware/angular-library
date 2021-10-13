import {ElementRef} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {FormControl} from '../model/form-control';
import {ValidationError} from '../model/validation-errors';
import {ButtonDisabledWhenIsBusyDirective} from './button-disabled-when-is-busy.directive';

describe('ButtonDisabledWhenIsBusyDirective', () => {
  let button: HTMLButtonElement;
  let sut: ButtonDisabledWhenIsBusyDirective;
  let form: FormControl<string>;
  let mockValidatorResult: Subject<ValidationError[]>;
  const mockValidator: (value: string) => Observable<ValidationError[]> = (value) => mockValidatorResult;

  beforeEach(() => {
    mockValidatorResult = new Subject<ValidationError[]>();
    form = new FormControl('');
    button = document.createElement('button');
    sut = new ButtonDisabledWhenIsBusyDirective(new ElementRef(button));
  });

  describe('disabledWhenFormIsBusy', () => {
    it('sets button.disabled to true when form is disabled', () => {
      button.disabled = false;
      form.disable();
      sut.disabledWhenFormIsBusy = form;

      expect(button.disabled).toBeTrue();
    });

    it('sets button.disabled to false when form is enabled', () => {
      button.disabled = true;
      sut.disabledWhenFormIsBusy = form;

      expect(button.disabled).toBeFalse();
    });

    it('sets button.disabled to true when form was disabled after initialization', () => {
      sut.disabledWhenFormIsBusy = form;
      form.disable();

      expect(button.disabled).toBeTrue();
    });

    it('sets button.disabled to false when form was enabled after initialization', () => {
      form.disable();
      sut.disabledWhenFormIsBusy = form;
      form.enable();

      expect(button.disabled).toBeFalse();
    });

    it('sets button.disabled to true when form is validating', () => {
      form.validators.set([mockValidator]);
      sut.disabledWhenFormIsBusy = form;

      expect(button.disabled).toBeTrue();
    });

    it('sets button.disabled to false when form is not validating', () => {
      form.validators.set([mockValidator]);
      mockValidatorResult.next([]);
      sut.disabledWhenFormIsBusy = form;

      expect(button.disabled).toBeFalse();
    });

    it('sets button.disabled to false when form finished validating after initialization', () => {
      form.validators.set([mockValidator]);
      sut.disabledWhenFormIsBusy = form;
      mockValidatorResult.next([]);

      expect(button.disabled).toBeFalse();
    });

    it("doesn't change button.disabled when form isValid changes", () => {
      form.validators.set([mockValidator]);
      sut.disabledWhenFormIsBusy = form;
      mockValidatorResult.next([new ValidationError()]);

      expect(button.disabled).toBeFalse();

      mockValidatorResult.next([]);

      expect(button.disabled).toBeFalse();
    });

    it('stops listening for changes on old form when disabledWhenFormIsBusy was changed', () => {
      sut.disabledWhenFormIsBusy = form;
      sut.disabledWhenFormIsBusy = new FormControl('');
      expect(button.disabled).toBeFalse();
      form.disable();
      expect(button.disabled).toBeFalse();
    });
  });

  describe('ngOnDestroy', () => {
    it('stops listening for changes on form', () => {
      sut.disabledWhenFormIsBusy = form;
      sut.ngOnDestroy();
      expect(button.disabled).toBeFalse();
      form.disable();
      expect(button.disabled).toBeFalse();
    });
  });
});
