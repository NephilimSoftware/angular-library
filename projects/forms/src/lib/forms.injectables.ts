import {InjectionToken} from '@angular/core';
import {IFormControlComponent} from './components/form-control.component';

export const FORM_CONTROL_COMPONENT: InjectionToken<IFormControlComponent> = new InjectionToken(
  'FormsModule.formControlComponent'
);
