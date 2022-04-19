import {FormControl, FormGroup} from '@angular/forms';
import {setChildEnabled} from './set-child-enabled';

describe('setChildEnabled', () => {
  let formGroup: FormGroup;
  let control: FormControl;
  let setControlEnabled: (isEnabled: boolean) => void;

  beforeEach(() => {
    formGroup = new FormGroup({});
    control = new FormControl();
    setControlEnabled = setChildEnabled(formGroup, 'testField', control);
    formGroup.addControl('testField', control);
  });

  it('sets child as disabled', () => {
    control.enable();
    setControlEnabled(false);

    expect(formGroup.get('testField')).toBe(null);
    expect(control.disabled).toBe(true);
  });

  it('sets child as enabled', () => {
    control.disable();
    setControlEnabled(true);

    expect(formGroup.get('testField')).toEqual(control);
    expect(control.enabled).toBe(true);
  });
});
