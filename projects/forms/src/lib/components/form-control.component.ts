import {EventEmitter} from '@angular/core';
import {ValidationError} from '../model/validation-errors';

export interface IFormControlComponent<TValue = any> {
  formControlValue: TValue;
  formControlValueChange: EventEmitter<TValue>;
  isDisabled: boolean;
  validationErrors?: ValidationError[];
  touched?: EventEmitter<void>;
}
