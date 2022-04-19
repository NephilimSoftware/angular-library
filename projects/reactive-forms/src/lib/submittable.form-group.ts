import {HttpErrorResponse} from '@angular/common/http';
import {AbstractControl, FormGroup, ValidationErrors, ValidatorFn} from '@angular/forms';
import {ValidationError} from './validation.error';
import {read} from '@nephilimsoftware/observables';
import {Observable} from 'rxjs';

export function RemoteField<TTarget extends SubmittableFormGroup>(
  remoteFieldName: string
): (target: TTarget, fieldName: string) => void {
  return (target: TTarget, fieldName: string): void => {
    target.registerRemoteField(remoteFieldName, fieldName);
  };
}

export class SubmittableFormGroup extends FormGroup {
  private static _revalidate(control: AbstractControl): void {
    if (control instanceof FormGroup) {
      Object.values(control.controls).forEach(SubmittableFormGroup._revalidate);
    }

    control.updateValueAndValidity();
    control.markAsTouched();
    control.markAsDirty();
  }

  private static _getValidationErrors(control: AbstractControl): ValidationErrors | null {
    if (control instanceof FormGroup) {
      const result: ValidationErrors = {};

      Object.keys(control.controls).forEach((key) => {
        const keyControl: AbstractControl | null = control.get(key);
        const validationErrors: ValidationErrors | null = keyControl
          ? SubmittableFormGroup._getValidationErrors(keyControl)
          : null;
        if (validationErrors) {
          result[key] = validationErrors;
        }
      });

      if (Object.keys(result).length === 0 && control.errors) {
        return control.errors;
      }

      return Object.keys(result).length > 0 ? result : null;
    }
    return control.errors;
  }

  private readonly _remoteFieldValidators: {[remoteFieldName: string]: ValidatorFn} = {};
  private _remoteFields!: {[remoteFieldName: string]: string};

  public constructor() {
    super({});

    this._remoteFields = this._remoteFields ?? {};
  }

  public async submit<TResult>(task: Observable<TResult>): Promise<TResult> {
    this._setRemoteValidationErrors({});
    SubmittableFormGroup._revalidate(this);
    const validationErrors: ValidationErrors | null = SubmittableFormGroup._getValidationErrors(this);

    if (validationErrors) {
      throw new ValidationError(validationErrors);
    }

    this.disable();
    try {
      const result: TResult = await read(task);

      this.markAsPristine();
      this.markAsUntouched();

      return result;
    } catch (response) {
      if (response instanceof HttpErrorResponse) {
        this._setRemoteValidationErrors(response.error.errors);
      }

      throw response;
    } finally {
      this.enable();
    }
  }

  public registerRemoteField(remoteFieldName: string, localFieldName: string): void {
    this._remoteFields = {
      ...this._remoteFields,
      [remoteFieldName]: localFieldName,
    };
  }

  private _setRemoteValidationErrors(validationErrors: {[remoteField: string]: string}): void {
    Object.keys(this._remoteFields).forEach((remoteField) => {
      this._removeRemoteValidationError(remoteField);
    });
    Object.keys(validationErrors).forEach((remoteField) => {
      this._setRemoteValidationError(remoteField, validationErrors[remoteField][0] ?? '');
    });
  }

  private _setRemoteValidationError(remoteField: string, message: string): void {
    const control: AbstractControl | null = this._getControl(remoteField);
    if (control) {
      this._remoteFieldValidators[remoteField] = () => ({remote: {message}});
      control.addValidators(this._remoteFieldValidators[remoteField]);
      control.markAsTouched();
      control.updateValueAndValidity();
    }
  }

  private _removeRemoteValidationError(remoteField: string): void {
    const control: AbstractControl | null = this._getControl(remoteField);
    if (control && this._remoteFieldValidators[remoteField]) {
      control.removeValidators(this._remoteFieldValidators[remoteField]);
      control.updateValueAndValidity();
      delete this._remoteFieldValidators[remoteField];
    }
  }

  private _getControl(remoteField: string): AbstractControl | null {
    const localField: string = this._remoteFields[remoteField];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const control: any = (this as any)[localField];
    if (!control) {
      return null;
    }
    if (control instanceof AbstractControl) {
      return control;
    }

    throw new Error(`Expected control on field ${localField} to be AbstractControl.`);
  }
}
