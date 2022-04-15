import {FormControl, Validators} from '@angular/forms';
import {Observable, Subscriber} from 'rxjs';
import {wrapCallbackWithSpy} from './model/callback.spec';
import {SubmittableFormGroup} from './submittable.form-group';
import {ValidationError} from './validation.error';
import Spy = jasmine.Spy;

describe('SubmittableFormGroup', () => {
  let form: SubmittableFormGroup;
  let control: FormControl;
  let observableTask: Spy;
  let observable: Observable<number>;

  beforeEach(() => {
    form = new SubmittableFormGroup();
    control = new FormControl();
    observableTask = wrapCallbackWithSpy((observer: Subscriber<number>) => observer.next(333));
    observable = new Observable<number>(observableTask);

    form.addControl('control', control);
  });

  describe('submit', () => {
    it('throws an validation error when control is invalid', async () => {
      control.addValidators(Validators.required);
      try {
        await form.submit(observable);
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
      }
    });

    it('returns value from task when form is valid', async () => {
      const result: number = await form.submit(observable);
      expect(result).toBe(333);
    });
  });
});
