import {Subject} from 'rxjs';
import {untilIsReady, IFormControl, IValidateFormValue} from './api';
import {qualityCheckFormControl} from './api.spec';
import {createCallbackSpy} from './callback.spec';
import {FormControl} from './form-control';
import {read} from './observables';
import {ValidationError, ValueIsRequiredValidationError} from './validation-errors';
import Spy = jasmine.Spy;

describe('FormControl', () => {
  class MockError extends ValidationError {
    constructor(label: string) {
      super();
    }
  }

  qualityCheckFormControl<string>(() => new FormControl(''));

  describe('validationErrors', () => {
    const expectedValidationErrors: ValidationError[] = [new ValidationError()];
    const validator: IValidateFormValue<string> = () => expectedValidationErrors;

    it('is containing validation error when initial value is invalid', async () => {
      const sut: FormControl<string> = new FormControl<string>('', [validator]);
      expect(await read(sut.validationErrors)).toEqual(expectedValidationErrors);
    });

    it('is containing validation error when validator was set', async () => {
      const sut: FormControl<string> = new FormControl<string>('', []);
      expect(await read(sut.validationErrors)).toEqual([]);
      sut.validators.set([validator]);
      expect(await read(sut.validationErrors)).toEqual(expectedValidationErrors);
    });

    it("is not dispatching when validation errors didn't change", async () => {
      const sut: FormControl<string> = new FormControl<string>('', []);
      const callback: (v: ValidationError[]) => void = createCallbackSpy();
      sut.validators.set([(v) => (v.length > 2 ? [new ValueIsRequiredValidationError()] : [])]);
      sut.validationErrors.subscribe(callback);

      sut.value.set('a');
      sut.value.set('b');
      sut.value.set('c');
      sut.value.set('Fura');
      sut.value.set('Janusz');
      sut.value.set('Gawendi');

      expect(callback).toHaveBeenCalledTimes(2);
      expect(callback).toHaveBeenCalledWith([new ValueIsRequiredValidationError()]);
      expect(callback).toHaveBeenCalledWith([]);
    });

    it('is dispatching when validation errors did change', async () => {
      const firstError: ValidationError = new ValidationError();
      const secondError: ValidationError = new ValidationError();
      const thirdError: ValidationError = new ValidationError();
      const sut: FormControl<string> = new FormControl<string>('', [() => [firstError, secondError]]);
      const callback: (v: ValidationError[]) => void = createCallbackSpy();
      sut.validationErrors.subscribe(callback);

      sut.validators.set([() => [secondError, thirdError]]);
      sut.value.set('a');
      sut.value.set('b');
      sut.value.set('c');
      sut.validators.set([() => [firstError, thirdError]]);
      sut.value.set('Fura');
      sut.value.set('Janusz');
      sut.value.set('Gawendi');

      expect(callback).toHaveBeenCalledTimes(3);
      expect(callback).toHaveBeenCalledWith([firstError, secondError]);
      expect(callback).toHaveBeenCalledWith([secondError, thirdError]);
      expect(callback).toHaveBeenCalledWith([firstError, thirdError]);
    });

    it('is not containing validation errors when validators were removed', async () => {
      const sut: FormControl<string> = new FormControl<string>('', [validator]);
      sut.validators.set([]);
      expect(await read(sut.validationErrors)).toEqual([]);
    });

    it('is validating automatically when initial validators were passed', async () => {
      const result: Subject<ValidationError[]> = new Subject<ValidationError[]>();

      const sut: FormControl<string> = new FormControl<string>('', [() => result]);
      expect(await read(sut.validationErrors)).toEqual([]);

      result.next(expectedValidationErrors);

      expect(await read(sut.validationErrors)).toEqual(expectedValidationErrors);
    });

    it('is validating automatically after setting validators', async () => {
      const result: Subject<ValidationError[]> = new Subject<ValidationError[]>();

      const sut: FormControl<string> = new FormControl<string>('', []);
      expect(await read(sut.validationErrors)).toEqual([]);
      sut.validators.set([() => result]);
      expect(await read(sut.validationErrors)).toEqual([]);

      result.next(expectedValidationErrors);

      expect(await read(sut.validationErrors)).toEqual(expectedValidationErrors);
    });

    it('is validating after changing value', async () => {
      const result: Subject<ValidationError[]> = new Subject<ValidationError[]>();

      const sut: FormControl<string> = new FormControl<string>('', [() => result]);
      result.next([]);

      expect(await read(sut.validationErrors)).toEqual([]);

      sut.value.set('Test');

      expect(await read(sut.validationErrors)).toEqual([]);

      result.next(expectedValidationErrors);

      expect(await read(sut.validationErrors)).toEqual(expectedValidationErrors);
    });

    it('is updating when validator reemited new validation errors', async () => {
      const result: Subject<ValidationError[]> = new Subject<ValidationError[]>();

      const sut: FormControl<string> = new FormControl<string>('', [() => result]);
      result.next([]);

      expect(await read(sut.validationErrors)).toEqual([]);

      result.next(expectedValidationErrors);

      expect(await read(sut.validationErrors)).toEqual(expectedValidationErrors);
    });

    it('is changing only when all validators have finished working', async () => {
      const firstResult: Subject<ValidationError[]> = new Subject<ValidationError[]>();
      const firstValidationError: ValidationError = new ValidationError();

      const secondResult: Subject<ValidationError[]> = new Subject<ValidationError[]>();
      const secondValidationError: ValidationError = new ValidationError();

      const sut: FormControl<string> = new FormControl<string>('', [() => firstResult, () => secondResult]);

      expect(await read(sut.validationErrors)).toEqual([]);

      firstResult.next([firstValidationError]);

      expect(await read(sut.validationErrors)).toEqual([]);

      secondResult.next([secondValidationError]);

      expect(await read(sut.validationErrors)).toEqual([firstValidationError, secondValidationError]);
    });
  });

  describe('isValid', () => {
    it('returns false when there is validation error', async () => {
      const sut: FormControl<string> = new FormControl<string>('');
      sut.validators.set([() => [new MockError('Fura')]]);
      expect(await read(sut.isValid)).toBeFalse();
    });
  });

  describe('isInvalid', () => {
    it('returns false when there is validation error', async () => {
      const sut: FormControl<string> = new FormControl<string>('');
      sut.validators.set([() => [new MockError('Fura')]]);
      expect(await read(sut.isInvalid)).toBeTrue();
    });
  });

  describe('validators', () => {
    const expectedValidationErrors: ValidationError[] = [new ValidationError()];

    it('supports Observable validator', async (done) => {
      const result: Subject<ValidationError[]> = new Subject<ValidationError[]>();

      const sut: IFormControl<string> = new FormControl<string>('', [() => result]);

      untilIsReady(sut).then(async () => {
        expect(await read(sut.validationErrors)).toEqual(expectedValidationErrors);
        done();
      });

      result.next(expectedValidationErrors);
    });

    it('supports Promise validator', async (done) => {
      let resolve: (value: ValidationError[]) => void;
      const result: Promise<ValidationError[]> = new Promise((r) => (resolve = r));

      const sut: FormControl<string> = new FormControl<string>('', [() => result]);

      untilIsReady(sut).then(async () => {
        expect(await read(sut.validationErrors)).toEqual(expectedValidationErrors);
        done();
      });

      // @ts-ignore
      resolve(expectedValidationErrors);
    });
  });

  describe('isValidating', () => {
    it('is initially set to true when asynchronous validator is processing value', async () => {
      const result: Subject<ValidationError[]> = new Subject<ValidationError[]>();

      const sut: FormControl<string> = new FormControl<string>('', [() => result]);
      expect(await read(sut.isValidating)).toBeTrue();

      result.next([]);

      expect(await read(sut.isValidating)).toBeFalse();
    });

    it('is changing to true after setting asynchronous Observable validator and changes to false after it finishes', async () => {
      const result: Subject<ValidationError[]> = new Subject<ValidationError[]>();

      const sut: FormControl<string> = new FormControl<string>('', []);
      expect(await read(sut.isValidating)).toBeFalse();
      sut.validators.set([() => result]);
      expect(await read(sut.isValidating)).toBeTrue();

      result.next([]);

      expect(await read(sut.isValidating)).toBeFalse();
    });
  });

  describe('destroy', () => {
    let sut: FormControl<string>;
    let callback: Spy;

    beforeEach(() => {
      sut = new FormControl<string>('');
      callback = createCallbackSpy();
    });

    it('stops executing callbacks for value', () => {
      sut.value.set('test');
      sut.value.subscribe(callback);
      expect(callback).toHaveBeenCalledTimes(1);
      sut.destroy();
      sut.value.set('');
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('stops executing callbacks for validation', () => {
      sut.validators.set([() => [new ValidationError()]]);
      sut.validationErrors.subscribe(callback);
      sut.isValidating.subscribe(callback);
      sut.isValid.subscribe(callback);
      sut.isInvalid.subscribe(callback);
      expect(callback).toHaveBeenCalledTimes(4);
      sut.destroy();
      sut.validators.set([]);
      expect(callback).toHaveBeenCalledTimes(4);
    });
  });
});
