import {Component, OnDestroy} from '@angular/core';
import {FormControl} from '@nephilimsoftware/forms';

class Option {
  constructor(public readonly label: string) {}

  public toString(): string {
    return `[UserDefinedClass label: ${this.label}]`;
  }
}

@Component({
  templateUrl: 'select-multiple.page.html',
})
export class SelectMultiplePage implements OnDestroy {
  public readonly options: Option[] = [
    new Option('A'),
    new Option('B'),
    new Option('C'),
    new Option('D'),
  ];

  public readonly singleOption: Option = new Option('Fura');

  public readonly formControl: FormControl<Option[]> = new FormControl<Option[]>([
    this.options[1],
    this.singleOption,
  ]);

  public ngOnDestroy(): void {
    this.formControl.destroy();
  }
}
