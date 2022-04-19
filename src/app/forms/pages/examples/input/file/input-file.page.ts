import {Component, OnDestroy} from '@angular/core';
import {FormControl} from '@nephilimsoftware/forms';

@Component({
  templateUrl: 'input-file.page.html',
})
export class InputFilePage implements OnDestroy {
  public readonly wololo: FileList | null = null;
  public readonly firkrag: FormControl<FileList | null> = new FormControl<FileList | null>(this.wololo);

  public format(value: FileList | null): string {
    if (value === null) {
      return 'null';
    }

    const files: File[] = Array.from(<any>value);
    return files.map((file) => file.name).join(', ');
  }

  public ngOnDestroy(): void {
    this.firkrag.destroy();
  }
}
