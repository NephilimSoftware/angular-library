import {Component, OnDestroy} from '@angular/core';
import {FormControl} from '@nephilimsoftware/forms';

@Component({
  templateUrl: 'input-password.page.html'
})
export class InputPasswordPage implements OnDestroy {
  public readonly wololo: string = 'lorem ipsum';
  public readonly firkrag: FormControl<string> = new FormControl<string>(this.wololo);

  public ngOnDestroy(): void {
    this.firkrag.destroy();
  }
}

