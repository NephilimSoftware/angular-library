import {AbstractControl} from '@angular/forms';

export function setDisabled(control: AbstractControl): (isDisabled: boolean) => void {
  return (isDisabled) => {
    if (isDisabled) {
      control.disable();
    } else {
      control.enable();
    }
  };
}
