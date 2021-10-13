import {Observable} from 'rxjs';
import {filter, switchMap, take, tap} from 'rxjs/operators';
import {IFormControl} from '../api';
import {unify} from '../observables';

export interface ISubmittable<TValue = any> {
  submit<TResult>(
    createSubmitTask: (value: TValue) => Promise<TResult> | Observable<TResult> | TResult
  ): Observable<TResult>;
}

export class SubmitFeature<TValue = any> implements ISubmittable {
  constructor(private readonly _formControl: IFormControl<TValue>) {}

  public submit<TResult>(
    createSubmitTask: (value: TValue) => Promise<TResult> | Observable<TResult> | TResult
  ): Observable<TResult> {
    this._formControl.disable();
    return this._formControl.isValidating.pipe(
      filter((isValidating) => !isValidating),
      switchMap(() => this._formControl.validationErrors),
      take(1),
      switchMap((validationErrors) => {
        if (validationErrors.length > 0) {
          this._formControl.enable();
          throw validationErrors;
        }
        return unify(createSubmitTask(this._formControl.value.get()));
      }),
      tap(this._formControl.enable),
      take(1)
    );
  }
}
