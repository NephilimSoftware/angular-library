import {Component, OnDestroy} from '@angular/core';
import {FormControl} from '@nephilimsoftware/forms';

@Component({
  templateUrl: 'input-checkbox.page.html'
})
export class InputCheckboxPage implements OnDestroy {
  public readonly wololo: boolean = false;
  public readonly firkrag: FormControl<boolean> = new FormControl<boolean>(this.wololo);

  public ngOnDestroy(): void {
    this.firkrag.destroy();
  }
}

