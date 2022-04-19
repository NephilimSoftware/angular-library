import {AbstractControl, FormGroup} from '@angular/forms';

export function setChildEnabled(
  formGroup: FormGroup,
  name: string,
  control: AbstractControl
): (isChild: boolean) => void {
  return (isChild) => {
    if (isChild) {
      control.enable();
      formGroup.addControl(name, control);
    } else {
      formGroup.removeControl(name);
      control.disable();
    }
  };
}
