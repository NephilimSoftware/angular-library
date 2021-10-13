import {createCallbackSpy} from '../callback.spec';
import {FormControl} from '../form-control';
import {read} from '../observables';
import {ValidationError} from '../validation-errors';
import {SubmitFeature} from './submit.feature';

describe('SubmitFeature', () => {
  let formControl: FormControl<string>;
  let sut: SubmitFeature<string>;
  let promise: Promise<string>;
  let resolve: (value: string) => void;
  let reject: (error: Error) => void;
  let createTask: (value: string) => Promise<string>;

  beforeEach(() => {
    formControl = new FormControl<string>('');
    sut = new SubmitFeature<string>(formControl);
    promise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    createTask = createCallbackSpy().and.returnValue(promise);
  });

  describe('submit', async () => {
    it('calls createTask callback with form controls current value', async () => {
      const expectedValue: string = 'Fura';

      formControl.value.set(expectedValue);

      resolve('');
      await read(sut.submit(createTask));

      expect(createTask).toHaveBeenCalledOnceWith(expectedValue);
    });

    it('disables formControl when submit is in progress', async () => {
      formControl.enable();
      sut.submit(createTask);

      expect(await read(formControl.isDisabled)).toBeTrue();
    });

    it('reenables formControl when submit has finished', async () => {
      resolve('Fura');
      await read(sut.submit(createTask));

      expect(await read(formControl.isDisabled)).toBeFalse();
    });

    it('returns value returned by task', async () => {
      const expectedResult: string = 'Fura';

      resolve(expectedResult);
      const result: string = await read(sut.submit(createTask));

      expect(result).toBe(expectedResult);
    });

    it('throws ValidationError when form has validation errors', async () => {
      const expectedErrors: ValidationError[] = [new ValidationError()];
      try {
        formControl.validators.set([() => expectedErrors]);
        await read(sut.submit(createTask));
        fail('Did not not throw error.');
      } catch (validationErrors) {
        expect(validationErrors).toEqual(expectedErrors);
      }
    });

    it("doesn't call createTask unit validation finishes", async () => {
      let finishValidating: (validationErrors: ValidationError[]) => void = () => {};
      const validationPromise: Promise<ValidationError[]> = new Promise((res) => (finishValidating = res));
      formControl.validators.set([() => validationPromise]);
      sut.submit(createTask).subscribe();

      expect(createTask).not.toHaveBeenCalled();
      finishValidating([]);
      await validationPromise;
      expect(createTask).toHaveBeenCalled();
    });
  });
});
