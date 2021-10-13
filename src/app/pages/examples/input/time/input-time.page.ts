import {Component, OnDestroy} from '@angular/core';
import {FormControl} from '@nephilimsoftware/forms';

@Component({
  templateUrl: 'input-time.page.html'
})
export class InputTimePage implements OnDestroy {
  public readonly wololo: Date | null = null;
  public readonly firkrag: FormControl<Date | null> = new FormControl<Date | null>(this.wololo);

  public ngOnDestroy(): void {
    this.firkrag.destroy();
  }
}

