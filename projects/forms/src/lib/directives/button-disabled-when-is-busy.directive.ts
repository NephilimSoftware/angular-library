import {Directive, ElementRef, Input, OnDestroy} from '@angular/core';
import {combineLatest, Subscription} from 'rxjs';
import {IFormControl} from '../model/api';
import {atLeastOneIsTrue} from '../model/observables';

@Directive({
  selector: 'button[[disabledWhenFormIsBusy]]',
})
export class ButtonDisabledWhenIsBusyDirective implements OnDestroy {
  private _isDisabledSubscription: Subscription | null = null;

  private readonly _button: HTMLButtonElement = this._elementRef.nativeElement;

  @Input()
  public set disabledWhenFormIsBusy(value: IFormControl) {
    this._isDisabledSubscription?.unsubscribe();
    this._isDisabledSubscription = combineLatest([value.isDisabled, value.isValidating])
      .pipe(atLeastOneIsTrue())
      .subscribe((isDisabled) => (this._button.disabled = isDisabled));
  }

  public constructor(private readonly _elementRef: ElementRef) {}

  public ngOnDestroy(): void {
    this._isDisabledSubscription?.unsubscribe();
    this._isDisabledSubscription = null;
  }
}
