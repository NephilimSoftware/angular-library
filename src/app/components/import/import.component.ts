import {Component, Input} from '@angular/core';

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
