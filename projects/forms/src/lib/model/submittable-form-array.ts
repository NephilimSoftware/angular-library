import {Observable} from 'rxjs';
import {IFormControl} from './api';
import {ISubmittable, SubmitFeature} from './features/submit.feature';
import {FormArray} from './form-array';

export class SubmittableFormArray<
    TItemValue = any,
    TItemFormControl extends IFormControl<TItemValue> = IFormControl<TItemValue>
  >
  extends FormArray<TItemValue, TItemFormControl>
  implements ISubmittable<TItemValue[]> {
  private readonly _submitFeature: SubmitFeature = new SubmitFeature<TItemValue[]>(this);
  public submit<TResult>(
    createSubmitTask: (value: TItemValue[]) => Promise<TResult> | Observable<TResult> | TResult
  ): Observable<TResult> {
    return this._submitFeature.submit(createSubmitTask);
  }
}
