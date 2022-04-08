import {FormControl} from '@angular/forms';
import {currentValue} from './abstract-control';
import {read} from '@nephilimSoftwarePackages/observables';

describe('AbstractControl', () => {
  let abstractControl: FormControl;

  beforeEach(() => {
    abstractControl = new FormControl('init');
  });

  describe('currentValue', () => {
    it('gets initial value', async () => {
      expect(await read(currentValue(abstractControl))).toBe('init');
    });

    it('gets last value when several "setValue" was called', async () => {
      abstractControl.setValue('first');
      abstractControl.setValue('second');
      expect(await read(currentValue(abstractControl))).toBe('second');
    });
  });
});
