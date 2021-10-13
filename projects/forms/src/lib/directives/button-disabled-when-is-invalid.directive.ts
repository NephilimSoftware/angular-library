import {Directive, ElementRef, Input, OnDestroy} from '@angular/core';
import {combineLatest, Subscription} from 'rxjs';
import {IFormControl} from '../model/api';
import {atLeastOneIsTrue} from '../model/observables';

@Directive({
  selector: 'button[[disabledWhenFormIsInvalid]]',
})
export class ButtonDisabledWhenIsInvalidDirective implements OnDestroy {
  private readonly _button: HTMLButtonElement = this._elementRef.nativeElement;

  private _isDisabledSubscription: Subscription | null = null;

  @Input()
  public set disabledWhenFormIsInvalid(value: IFormControl) {
    this._isDisabledSubscription?.unsubscribe();
    this._isDisabledSubscription = combineLatest([value.isDisabled, value.isValidating, value.isInvalid])
          .pipe(atLeastOneIsTrue())
          .subscribe((isDisabled) => (this._button.disabled = isDisabled));
  }

  public constructor(private readonly _elementRef: ElementRef) {}

  public ngOnDestroy(): void {
    this._isDisabledSubscription?.unsubscribe();
    this._isDisabledSubscription = null;
  }
}
