import {Observable} from 'rxjs';
import {ISubmittable, SubmitFeature} from './features/submit.feature';
import {Form} from './form';

export class SubmittableForm<TValue = any> extends Form<TValue> implements ISubmittable<TValue> {
  private readonly _submitFeature: SubmitFeature = new SubmitFeature<TValue>(this);
  public submit<TResult>(
    createSubmitTask: (value: TValue) => Promise<TResult> | Observable<TResult> | TResult
  ): Observable<TResult> {
    return this._submitFeature.submit(createSubmitTask);
  }
}
