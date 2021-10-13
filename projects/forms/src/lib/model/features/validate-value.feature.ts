import {combineLatest, BehaviorSubject, Observable, Subscription} from 'rxjs';
import {distinctUntilChanged, map, switchMap, tap} from 'rxjs/operators';
import {IValidateFormValue} from '../api';
import {flatten} from '../array';
import {unify} from '../observables';
import {ValidationError} from '../validation-errors';

export class ValidateValueFeature<TValue> {
  private readonly _isValidating: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public readonly isValidating: Observable<boolean> = this._isValidating.pipe(distinctUntilChanged());

  private readonly _validationErrors: BehaviorSubject<ValidationError[]> = new BehaviorSubject<ValidationError[]>([]);
  public readonly validationErrors: Observable<ValidationError[]> = this._validationErrors;

  private readonly _subscription: Subscription;

  constructor(
    private readonly _value: Observable<TValue>,
    private readonly _validators: Observable<IValidateFormValue<TValue>[]>
  ) {
    this._subscription = combineLatest([this._value, this._validators])
      .pipe(
        tap(() => this._isValidating.next(true)),
        switchMap(([value, validators]) => this._validateValue(value, validators))
      )
      .subscribe((validationErrors) => {
        if (this._didValidationErrorsChange(validationErrors)) {
          this._validationErrors.next(validationErrors);
        }
        this._isValidating.next(false);
      });
  }

  private _didValidationErrorsChange(updatedValidationErrors: ValidationError[]): boolean {
    const validationErrors: ValidationError[] = this._validationErrors.value;
    if (validationErrors.length !== updatedValidationErrors.length) {
      return true;
    }

    for (let i: number = 0; i < validationErrors.length; i++) {
      if (!validationErrors[i].isEqual(updatedValidationErrors[i])) {
        return true;
      }
    }

    return false;
  }

  public destroy(): void {
    this._subscription.unsubscribe();
  }

  private _validateValue(value: TValue, validators: IValidateFormValue<TValue>[]): Observable<ValidationError[]> {
    return validators.length > 0
      ? combineLatest(validators.map((validate) => unify(validate(value)))).pipe(map(flatten))
      : new BehaviorSubject([]);
  }
}
