import {Component, OnDestroy} from '@angular/core';
import {FormControl} from '@nephilimsoftware/forms';

class UserDefinedClass {
  constructor(public readonly label: string) {}

  public toString(): string {
    return `[UserDefinedClass label: ${this.label}]`;
  }
}

@Component({
  templateUrl: 'input-radio.page.html'
})
export class InputRadioPage implements OnDestroy {
  public readonly userDefinedValues: UserDefinedClass[] = [
    new UserDefinedClass('A'),
    new UserDefinedClass('B'),
    new UserDefinedClass('C'),
    new UserDefinedClass('D'),
  ];

  public readonly firkrag: FormControl<UserDefinedClass | null> = new FormControl<UserDefinedClass | null>(this.userDefinedValues[1]);

  public ngOnDestroy(): void {
    this.firkrag.destroy();
  }
}

