import {Component, Input, OnDestroy} from '@angular/core';
import {FormControl} from '@nephilimsoftware/forms';
import {BehaviorSubject, Subscription} from 'rxjs';
import {skip} from 'rxjs/operators';

@Component({
  selector: 'app-control-events-log',
  templateUrl: 'control-events-log.component.html',
})
export class ControlEventsLogComponent<TValue> implements OnDestroy {
  private _controlSubscriptions: Subscription[] = [];
  private _control: FormControl<TValue> | null = null;
  @Input()
  public get control(): FormControl<TValue> {
    if (!this._control) {
      throw new Error('Not initialized yet.');
    }

    return this._control;
  }
  public set control(value: FormControl<TValue>) {
    this._controlSubscriptions.forEach((subscription) => subscription.unsubscribe());

    this._control = value;

    this._controlSubscriptions = this._control
      ? [
          this._control.value.changing.subscribe(this._logEvent),
          this._control.value.changed.subscribe(this._logEvent),
          this._control.isDirty.pipe(skip(1)).subscribe((v) => this._logEvent(`[ValueChanged isDirty: ${v}]`)),
          this._control.wasTouched.pipe(skip(1)).subscribe((v) => this._logEvent(`[ValueChanged wasTouched: ${v}]`)),
          this._control.isDisabled.pipe(skip(1)).subscribe((v) => this._logEvent(`[ValueChanged isDisabled: ${v}]`)),
          this._control.validationErrors.pipe(skip(1)).subscribe((v) => this._logEvent(`[ValueChanged validationErrors: ${v}]`)),
        ]
      : [];
  }

  public readonly logs: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

  private readonly _logEvent = <TEvent>(e: TEvent): void => {
    this.logs.next([`${e}`, ...this.logs.value]);
  };

  public ngOnDestroy(): void {
    this._controlSubscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
