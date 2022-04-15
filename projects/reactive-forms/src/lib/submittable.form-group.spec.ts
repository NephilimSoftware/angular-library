import {FormControl, Validators} from '@angular/forms';
import {Observable, Subscriber} from 'rxjs';
import {wrapCallbackWithSpy} from './model/callback.spec';
import {SubmittableFormGroup} from './submittable.form-group';
import {ValidationError} from './validation.error';
import Spy = jasmine.Spy;

describe('SubmittableFormGroup', () => {
  let form: SubmittableFormGroup;
  let control: FormControl;
  let submitTaskCallback: Spy;
  let submitTask: Observable<number>;

  beforeEach(() => {
    form = new SubmittableFormGroup();
    control = new FormControl();
    submitTaskCallback = wrapCallbackWithSpy((observer: Subscriber<number>) => observer.next(333));
    submitTask = new Observable<number>(submitTaskCallback);

    form.addControl('control', control);
  });

  describe('submit', () => {
    it('throws an validation error when control is invalid', async () => {
      control.addValidators(Validators.required);
      try {
        await form.submit(submitTask);
        fail('Expected submit to throw an error');
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
      }
    });

    it('returns value from task when form is valid', async () => {
      const result: number = await form.submit(submitTask);
      expect(result).toBe(333);
    });
  });
});
