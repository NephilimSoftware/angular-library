import {combineLatest, BehaviorSubject, Observable} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import {IFormControl} from '../api';
import {allAreTrue, negate} from '../observables';

export class IsEnabledFeature {
  private readonly _isEnabled: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  public readonly isEnabled: Observable<boolean>;
  public readonly isDisabled: Observable<boolean>;

  constructor(parent: Observable<IFormControl | null>) {
    this.isEnabled = combineLatest([
      this._isEnabled,
      parent.pipe(switchMap((p) => (p ? p.isEnabled : new BehaviorSubject(true)))),
    ]).pipe(allAreTrue());
    this.isDisabled = this.isEnabled.pipe(negate());
  }

  public readonly disable = (): void => {
    this._isEnabled.next(false);
  };
  public readonly enable = (): void => {
    this._isEnabled.next(true);
  };

  public destroy(): void {
    this._isEnabled.complete();
  }
}
