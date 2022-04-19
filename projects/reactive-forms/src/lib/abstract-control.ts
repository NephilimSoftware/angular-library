import {AbstractControl} from '@angular/forms';
import {warmUp} from '@nephilimsoftware/observables';
import {Observable} from 'rxjs';
import {distinctUntilChanged, shareReplay, startWith} from 'rxjs/operators';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function currentValue<TValue = any>(control: AbstractControl): Observable<TValue> {
  return warmUp(
    control.valueChanges.pipe(startWith<TValue, TValue>(control.value), distinctUntilChanged(), shareReplay(1))
  );
}
