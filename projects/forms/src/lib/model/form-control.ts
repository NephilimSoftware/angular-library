import {BehaviorSubject, Observable} from 'rxjs';
import {distinctUntilChanged, map} from 'rxjs/operators';
import {IFormControl, IFormControlParent, IValidateFormValue} from './api';
import {IsEnabledFeature} from './features/is-enabled.feature';
import {ValidateValueFeature} from './features/validate-value.feature';
import {FormControlParentGuard} from './form-control-parent-guard';
import {IsEqual} from './object';
import {negate} from './observables';
import {FormControlProperty} from './properties/form-control-property';
import {ValidationError} from './validation-errors';

export class FormControl<TValue = any> implements IFormControl<TValue> {
  private readonly _isEnabledFeature: IsEnabledFeature;
  private readonly _isPristine: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  private readonly _isUntouched: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  private readonly _validateValueFeature: ValidateValueFeature<TValue>;

  public readonly value: FormControlProperty<TValue>;
  public readonly parent: FormControlProperty<IFormControlParent | null>;

  public readonly validators: FormControlProperty<IValidateFormValue<TValue>[]>;
  public readonly validationErrors: Observable<ValidationError[]>;
  public readonly isValidating: Observable<boolean>;
  public readonly isValid: Observable<boolean>;
  public readonly isInvalid: Observable<boolean>;

  public readonly isEnabled: Observable<boolean>;
  public readonly isDisabled: Observable<boolean>;

  public readonly isUntouched: Observable<boolean> = this._isUntouched.pipe(distinctUntilChanged());
  public readonly wasTouched: Observable<boolean> = this.isUntouched.pipe(negate());

  public readonly isPristine: Observable<boolean> = this._isPristine.pipe(distinctUntilChanged());
  public readonly isDirty: Observable<boolean> = this.isPristine.pipe(negate());

  private readonly _parentGuard: FormControlParentGuard<TValue>;

  constructor(
    initialValue: TValue,
    validators: IValidateFormValue<TValue>[] = [],
    isEqual: IsEqual<TValue> = (a, b) => a === b
  ) {
    this.value = new FormControlProperty(initialValue, isEqual);
    this.parent = new FormControlProperty<IFormControlParent | null>(null);
    this._parentGuard = new FormControlParentGuard<TValue>(this, this.parent);
    this.validators = new FormControlProperty<IValidateFormValue<TValue>[]>(validators);

    this._isEnabledFeature = new IsEnabledFeature(this.parent);
    this.isEnabled = this._isEnabledFeature.isEnabled;
    this.isDisabled = this._isEnabledFeature.isDisabled;

    this._validateValueFeature = new ValidateValueFeature(this.value, this.validators);
    this.validationErrors = this._validateValueFeature.validationErrors;
    this.isValidating = this._validateValueFeature.isValidating;
    this.isValid = this.validationErrors.pipe(
      map((validationErrors) => validationErrors.length === 0),
      distinctUntilChanged()
    );
    this.isInvalid = this.isValid.pipe(negate());
  }

  public readonly disable = (): void => {
    this._isEnabledFeature.disable();
  };
  public readonly enable = (): void => {
    this._isEnabledFeature.enable();
  };

  public readonly markAsDirty = (): void => {
    this._isPristine.next(false);
  };
  public readonly markAsPristine = (): void => {
    this._isPristine.next(true);
  };

  public readonly markAsTouched = (): void => {
    this._isUntouched.next(false);
  };
  public readonly markAsUntouched = (): void => {
    this._isUntouched.next(true);
  };

  public destroy(): void {
    this._validateValueFeature.destroy();
    this._parentGuard.destroy();
    this.value.destroy();
    this.parent.destroy();
    this.validators.destroy();
    this._isPristine.complete();
    this._isUntouched.complete();
    this._isEnabledFeature.destroy();
  }
}
