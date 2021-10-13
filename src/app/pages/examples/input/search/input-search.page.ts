import {Component, OnDestroy} from '@angular/core';
import {FormControl} from '@nephilimsoftware/forms';

@Component({
  templateUrl: 'input-search.page.html'
})
export class InputSearchPage implements OnDestroy {
  public readonly wololo: string = 'Mint';
  public readonly firkrag: FormControl<string> = new FormControl<string>(this.wololo);

  public ngOnDestroy(): void {
    this.firkrag.destroy();
  }
}

