import {Component, Input} from '@angular/core';
import {FormControl} from '@nephilimsoftware/forms';

@Component({
  selector: 'app-control-debug',
  templateUrl: 'control-debug.component.html',
})
export class ControlDebugComponent<TValue> {
  @Input()
  public control!: FormControl<TValue>;

  @Input()
  public defaultValue!: TValue;

  @Input()
  public formatValue: (value: TValue) => string = (value) => `${value}`;
}
