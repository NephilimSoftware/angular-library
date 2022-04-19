import {Component, OnDestroy} from '@angular/core';
import {FormControl} from '@nephilimsoftware/forms';

@Component({
  templateUrl: 'input-number.page.html'
})
export class InputNumberPage implements OnDestroy {
  public readonly wololo: number = 333;
  public readonly firkrag: FormControl<number> = new FormControl<number>(this.wololo);

  public ngOnDestroy(): void {
    this.firkrag.destroy();
  }
}

