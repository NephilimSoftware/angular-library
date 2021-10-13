import {Component, OnDestroy} from '@angular/core';
import {FormControl} from '@nephilimsoftware/forms';

@Component({
  templateUrl: 'input-range.page.html'
})
export class InputRangePage implements OnDestroy {
  public readonly wololo: number = 333;
  public readonly firkrag: FormControl<number> = new FormControl<number>(this.wololo);

  public ngOnDestroy(): void {
    this.firkrag.destroy();
  }
}

