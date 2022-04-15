import {FormControl} from '@angular/forms';
import {setDisabled} from './set-disabled';

describe('setDisabled', () => {
  let control: FormControl;

  beforeEach(() => {
    control = new FormControl();
  });

  it('should be disabled', () => {
    setDisabled(control)(true);
    expect(control.disabled).toBe(true);
  });

  it('should be enabled', () => {
    setDisabled(control)(false);
    expect(control.enabled).toBe(true);
  });
});
