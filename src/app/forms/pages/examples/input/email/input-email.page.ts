import {Component, OnDestroy} from '@angular/core';
import {FormControl} from '@nephilimsoftware/forms';

@Component({
  templateUrl: 'input-email.page.html'
})
export class InputEmailPage implements OnDestroy {
  public readonly wololo: string = 'fura@nephilim.software';
  public readonly firkrag: FormControl<string> = new FormControl<string>(this.wololo);

  public ngOnDestroy(): void {
    this.firkrag.destroy();
  }
}

