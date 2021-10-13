import {NgModule} from '@angular/core';
import {ButtonDisabledWhenIsBusyDirective} from './directives/button-disabled-when-is-busy.directive';
import {ButtonDisabledWhenIsInvalidDirective} from './directives/button-disabled-when-is-invalid.directive';
import {FormControlDirective} from './directives/form-control.directive';
import {FormDirective} from './directives/form.directive';
import {InputRadioDirective} from './directives/input-radio.directive';
import {InputDirective} from './directives/input.directive';
import {OptionDirective} from './directives/option.directive';
import {SelectMultipleDirective} from './directives/select-multiple.directive';
import {SelectDirective} from './directives/select.directive';
import {TextareaDirective} from './directives/textarea.directive';
import {RadioButtonGroupService} from './services/radio-button-group.service';

const directives: any = [
  ButtonDisabledWhenIsBusyDirective,
  ButtonDisabledWhenIsInvalidDirective,
  FormControlDirective,
  FormDirective,
  InputDirective,
  InputRadioDirective,
  OptionDirective,
  SelectDirective,
  SelectMultipleDirective,
  TextareaDirective,
];

@NgModule({
  declarations: [...directives],
  imports: [],
  exports: [...directives],
  providers: [RadioButtonGroupService],
})
export class FormsModule {}
