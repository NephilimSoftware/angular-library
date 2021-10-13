import {EventEmitter} from '@angular/core';
import {skip} from 'rxjs/operators';
import {IFormControlComponent} from '../components/form-control.component';
import {createCallbackSpy} from '../model/callback.spec';
import {FormControl} from '../model/form-control';
import {read} from '../model/observables';
import {Validate} from '../model/validate';
import {ValueIsRequiredValidationError} from '../model/validation-errors';
import {FormControlDirective} from './form-control.directive';

describe('FormControlDirective', () => {
  class MockFormControlComponent implements IFormControlComponent<string> {
    public formControlValue: string = '';
    public formControlValueChange: EventEmitter<string> = new EventEmitter<string>();
    public isDisabled: boolean = false;
    public touched: EventEmitter<void> = new EventEmitter<void>();
  }

  let formControl: FormControl<string>;
  let component: IFormControlComponent;
  let sut: FormControlDirective<string>;

  beforeEach(() => {
    formControl = new FormControl<string>('');
    component = new MockFormControlComponent();
    sut = new FormControlDirective<string>(component);
    sut.formControl = formControl;
  });

  describe('constructor', () => {
    it('allows component to not have touched EventEmitter defined', () => {
      component.touched = undefined;
      expect(() => {
        sut = new FormControlDirective<string>(component);
      }).not.toThrow();
    });
  });

  describe('formControl', () => {
    let updatedFormControl: FormControl<string>;
    beforeEach(() => {
      updatedFormControl = new FormControl<string>('Janusz');
    });

    it('deattaches previous formControl from events', () => {
      const callback: (v: any) => void = createCallbackSpy();
      formControl.value.pipe(skip(1)).subscribe(callback);
      formControl.isDirty.pipe(skip(1)).subscribe(callback);
      formControl.wasTouched.pipe(skip(1)).subscribe(callback);
      sut.formControl = updatedFormControl;
      component.touched?.emit();
      component.formControlValueChange.emit('Gawendi');
      expect(callback).not.toHaveBeenCalled();
    });

    it('sets component value to value from updatedFormControl', () => {
      sut.formControl = updatedFormControl;
      expect(component.formControlValue).toBe(updatedFormControl.value.get());
    });

    it('sets component isDisabled to value from updateFormControl', () => {
      expect(component.isDisabled).toBeFalse();
      updatedFormControl.disable();
      sut.formControl = updatedFormControl;
      expect(component.isDisabled).toBeTrue();
    });
  });
  describe('ngOnDestroy', () => {
    it('deattaches formControl from events', () => {
      const callback: (v: any) => void = createCallbackSpy();
      formControl.value.pipe(skip(1)).subscribe(callback);
      formControl.isDirty.pipe(skip(1)).subscribe(callback);
      formControl.wasTouched.pipe(skip(1)).subscribe(callback);
      sut.ngOnDestroy();
      component.touched?.emit();
      component.formControlValueChange.emit('Gawendi');
      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('dependency', () => {
    describe('component.formControlValueChange', () => {
      it('sets formControl value to one passed in event', () => {
        const expectedResult: string = 'Fura';
        expect(formControl.value.get()).not.toBe(expectedResult);
        component.formControlValueChange.emit(expectedResult);
        expect(formControl.value.get()).toBe(expectedResult);
      });

      it('marks formControl as dirty', async () => {
        expect(await read(formControl.isDirty)).toBeFalse();
        component.formControlValueChange.emit('Fura');
        expect(await read(formControl.isDirty)).toBeTrue();
      });

      it('marks formControl as dirty before setting value', () => {
        const valueCallback: (v: string) => void = createCallbackSpy();
        const isDirtyCallback: (v: boolean) => void = createCallbackSpy();
        const expectedResult: string = 'Fura';
        formControl.isDirty.pipe(skip(1)).subscribe((value) => {
          isDirtyCallback(value);
          expect(valueCallback).not.toHaveBeenCalled();
        });
        formControl.value.pipe(skip(1)).subscribe((value) => {
          valueCallback(value);
          expect(isDirtyCallback).toHaveBeenCalledOnceWith(true);
        });
        component.formControlValueChange.emit(expectedResult);
      });
    });

    describe('component.touched', () => {
      it('marks formControl as touched', async () => {
        expect(await read(formControl.wasTouched)).toBeFalse();
        component.touched?.emit();
        expect(await read(formControl.wasTouched)).toBeTrue();
      });
    });

    describe('component.validationErrors', () => {
      it('are not set when component validationErrors are undefined', async () => {
        component.validationErrors = undefined;
        formControl.value.set('');
        formControl.validators.set([Validate.isRequired]);
        expect(component.validationErrors).toBeUndefined();
      });

      it('are set when component validationErrors is not undefined', async () => {
        component.validationErrors = [];
        formControl.value.set('');
        formControl.validators.set([Validate.isRequired]);
        expect(component.validationErrors).toEqual([new ValueIsRequiredValidationError()]);
      });
    });

    describe('formControl.value', () => {
      it('changes component.formControlValue', () => {
        const expectedValue: string = 'Gawendi';
        expect(component.formControlValue).not.toBe(expectedValue);
        formControl.value.set(expectedValue);
        expect(component.formControlValue).toBe(expectedValue);
      });
    });
  });
});
