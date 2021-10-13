import {Component, OnDestroy} from '@angular/core';
import {FormControl} from '@nephilimsoftware/forms';

@Component({
  templateUrl: 'input-text.page.html'
})
export class InputTextPage implements OnDestroy {
  public readonly wololo: string = 'lorem ipsum';
  public readonly firkrag: FormControl<string> = new FormControl<string>(this.wololo);

  constructor() {
    this.firkrag.value.changing.subscribe((e) => {
      if (e.currentValue.length > 10) {
        e.cancel();
      }
    });
  }

  public ngOnDestroy(): void {
    this.firkrag.destroy();
  }
}

