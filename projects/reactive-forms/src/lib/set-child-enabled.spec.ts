import {FormControl, FormGroup} from '@angular/forms';
import {setChildEnabled} from './set-child-enabled';

describe('setChildEnabled', () => {
  let formGroup: FormGroup;
  let control: FormControl;
  let setControlEnabled: (isEnabled: boolean) => void;

  beforeEach(() => {
    formGroup = new FormGroup({});
    control = new FormControl();
    setControlEnabled = setChildEnabled(formGroup, 'control', control);
  });

  it('sets child as disabled', () => {
    formGroup.addControl('control', control);

    setControlEnabled(false);
    expect(formGroup.get('control')).toBe(null);
    expect(control.disabled).toBe(true);
  });

  it('sets child as enabled', () => {
    setControlEnabled(true);
    expect(formGroup.get('control')).toEqual(control);
    expect(control.enabled).toBe(true);
  });
});
