import {Component, OnDestroy} from '@angular/core';
import {FormControl} from '@nephilimsoftware/forms';

@Component({
  templateUrl: 'input-datetime-local.page.html'
})
export class InputDatetimeLocalPage implements OnDestroy {
  public readonly wololo: Date | null = null;
  public readonly firkrag: FormControl<Date | null> = new FormControl<Date | null>(this.wololo);

  public ngOnDestroy(): void {
    this.firkrag.destroy();
  }
}

