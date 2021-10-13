import {Component, Input, OnDestroy} from '@angular/core';
import {FormControl} from '@nephilimsoftware/forms';

@Component({
  selector: 'app-import',
  templateUrl: 'import.component.html',
})
export class ImportComponent {
  @Input()
  public classes: string = '';

  @Input()
  public package: string = '';
}
