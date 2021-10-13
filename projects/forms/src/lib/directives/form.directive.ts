import {Directive} from '@angular/core';
import {RadioButtonGroupService} from '../services/radio-button-group.service';

@Directive({
  selector: 'form',
  providers: [RadioButtonGroupService],
})
export class FormDirective {}
