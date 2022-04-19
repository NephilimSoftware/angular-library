import {HttpErrorResponse} from '@angular/common/http';
import {FormControl, Validators} from '@angular/forms';
import {Observable, Subscriber} from 'rxjs';
import {wrapCallbackWithSpy} from './model/callback.spec';
import {SubmittableFormGroup} from './submittable.form-group';
import {ValidationError} from './validation.error';
import Spy = jasmine.Spy;

describe('SubmittableFormGroup', () => {
  const ERROR: HttpErrorResponse = new HttpErrorResponse({
    error: {errors: {remoteField: ['test error message']}},
    status: 400,
  });

  class TestForm extends SubmittableFormGroup {
    public readonly testField: FormControl = new FormControl();

    constructor() {
      super();

      this.addControl('testField', this.testField);
    }
  }


  let form: TestForm;

  let submitTaskCallback: Spy;
  let submitTask: Observable<number>;
  let submitTaskWithErrorCallback: Spy;
  let submitTaskWithError: Observable<number>;

  beforeEach(() => {
    form = new TestForm();

    submitTaskCallback = wrapCallbackWithSpy((observer: Subscriber<number>) => observer.next(333));
    submitTask = new Observable<number>(submitTaskCallback);
    submitTaskWithErrorCallback = wrapCallbackWithSpy((observer: Subscriber<number>) => observer.error(ERROR));
    submitTaskWithError = new Observable<number>(submitTaskWithErrorCallback);
  });

  describe('submit', () => {
    it('throws an validation error when control is invalid', async () => {
      form.testField.addValidators(Validators.required);
      try {
        await form.submit(submitTask);
        fail('Expected submit to throw an error');
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
      }
    });

    it('fills remote fields when task throws an error', async () => {
      form.registerRemoteField('remoteField', 'testField');
      try {
        await form.submit(submitTaskWithError);
        fail('Expected submit to throw an error');
      } catch {}

      expect(form.testField.errors?.remote.message).toBe('test error message');
    });

    it('passes error when task throws an error', async () => {
      try {
        await form.submit(submitTaskWithError);
        fail('Expected submit to throw an error');
      } catch (error) {
        expect(error).toEqual(ERROR);
      }
    });

    it('returns value from task when form is valid', async () => {
      const result: number = await form.submit(submitTask);
      expect(result).toBe(333);
    });
  });
});
