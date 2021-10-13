import {Observable} from 'rxjs';
import {ISubmittable, SubmitFeature} from './features/submit.feature';
import {FormControl} from './form-control';

export class SubmittableFormControl<TValue = any> extends FormControl<TValue> implements ISubmittable<TValue> {
  private readonly _submitFeature: SubmitFeature = new SubmitFeature<TValue>(this);
  public submit<TResult>(
    createSubmitTask: (value: TValue) => Promise<TResult> | Observable<TResult> | TResult
  ): Observable<TResult> {
    return this._submitFeature.submit(createSubmitTask);
  }
}
