import {Directive, Inject, Input, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs';
import {IFormControlComponent} from '../components/form-control.component';
import {FORM_CONTROL_COMPONENT} from '../forms.injectables';
import {IFormControl} from '../model/api';
import {ValidationError} from '../model/validation-errors';

@Directive({
  selector: '[[formControl]]',
})
export class FormControlDirective<TValue> implements OnDestroy {
  private _formControl: IFormControl<TValue> | null = null;
  @Input()
  public set formControl(value: IFormControl<TValue>) {
    this._unsubscribeFormControl();
    this._formControl = value;
    this._formControlValueChangedSubscription = this._formControl.value.subscribe(
      this._onFormControlValueChanged
    );
    this._formControlIsDisabledChangedSubscription = this._formControl.isDisabled.subscribe(
      this._onFormControlIsDisabledChanged
    );
    this._formControlValidationErrorsChangedSubscription = this._formControl.validationErrors.subscribe(
      this._onFormControlValidationErrorsChanged
    );
  }

  private _formControlValueChangedSubscription: Subscription | null = null;
  private _formControlIsDisabledChangedSubscription: Subscription | null = null;
  private _formControlValidationErrorsChangedSubscription: Subscription | null = null;

  private readonly _componentValueChangedSubscription: Subscription;
  private readonly _componentFocusedSubscription: Subscription | null;

  public constructor(@Inject(FORM_CONTROL_COMPONENT) private readonly _component: IFormControlComponent) {
    this._componentValueChangedSubscription = this._component.formControlValueChange
      .subscribe(this._onComponentValueChanged);
    this._componentFocusedSubscription = this._component.touched?.subscribe(this._onComponentTouched) ?? null;
  }

  private readonly _onComponentValueChanged = (value: TValue) => {
    if (this._formControl) {
      if (value !== this._formControl.value.get()) {
        this._formControl.markAsDirty();
      }
      this._formControl.value.set(value);
    }
  };

  private readonly _onComponentTouched = () => {
    if (this._formControl) {
      this._formControl.markAsTouched();
    }
  };

  private _unsubscribeFormControl(): void {
    if (this._formControlIsDisabledChangedSubscription) {
      this._formControlIsDisabledChangedSubscription.unsubscribe();
      this._formControlIsDisabledChangedSubscription = null;
    }

    if (this._formControlValueChangedSubscription) {
      this._formControlValueChangedSubscription.unsubscribe();
      this._formControlValueChangedSubscription = null;
    }

    if (this._formControlValidationErrorsChangedSubscription) {
      this._formControlValidationErrorsChangedSubscription.unsubscribe();
      this._formControlValidationErrorsChangedSubscription = null;
    }
  }


  private readonly _onFormControlValueChanged = (value: TValue) => {
    this._component.formControlValue = value;
  };

  private readonly _onFormControlIsDisabledChanged = (isDisabled: boolean): void => {
    this._component.isDisabled = isDisabled;
  };

  private readonly _onFormControlValidationErrorsChanged = (validationErrors: ValidationError[]): void => {
    if (this._component.validationErrors !== undefined) {
      this._component.validationErrors = validationErrors;
    }
  };

  public ngOnDestroy(): void {
    this._componentValueChangedSubscription.unsubscribe();
    if (this._componentFocusedSubscription) {
      this._componentFocusedSubscription.unsubscribe();
    }
    this._unsubscribeFormControl();
    this._formControl = null;
  }
}
