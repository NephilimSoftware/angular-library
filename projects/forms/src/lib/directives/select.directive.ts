import {forwardRef, Directive, ElementRef, EventEmitter, Input, OnDestroy, Output} from '@angular/core';
import {Subscription} from 'rxjs';
import {IFormControlComponent} from '../components/form-control.component';
import {FORM_CONTROL_COMPONENT} from '../forms.injectables';
import {OptionsService} from '../services/options.service';

@Directive({
  selector: 'select[[formControl]]:not([multiple])',
  providers: [
    {
      provide: FORM_CONTROL_COMPONENT,
      useExisting: forwardRef(() => SelectDirective),
    },
    OptionsService,
  ],
})
export class SelectDirective<TValue> implements IFormControlComponent<TValue | null>, OnDestroy {
  private readonly _select: HTMLSelectElement = this._elementRef.nativeElement;

  private _formControlValue: TValue | null = null;
  @Input()
  public get formControlValue(): TValue | null {
    return this._formControlValue;
  }

  public set formControlValue(value: TValue | null) {
    const previousValue: TValue | null = this.formControlValue;
    if (previousValue !== value) {
      this._formControlValue = value;
      const options: HTMLOptionsCollection = this._select.options;
      for (let i: number = 0; i < options.length; i++) {
        options[i].selected = this._optionsService.getValue(options[i]) === this._formControlValue;
      }
      this.formControlValueChange.emit(this.formControlValue);
    }
  }

  @Input()
  public set isDisabled(value: boolean) {
    this._select.disabled = value;
  }

  @Output()
  public readonly touched: EventEmitter<void> = new EventEmitter<void>();

  @Output()
  public readonly formControlValueChange: EventEmitter<TValue | null> = new EventEmitter<TValue | null>();

  private readonly _optionChangedSubscription: Subscription;

  public constructor(
    private readonly _optionsService: OptionsService<TValue>,
    private readonly _elementRef: ElementRef
  ) {
    this._select.addEventListener('input', this._onInput);
    this._select.addEventListener('focus', this._onFocus);
    this._optionChangedSubscription = this._optionsService.optionChanged.subscribe(this._onOptionChanged);
  }

  public ngOnDestroy(): void {
    this._optionChangedSubscription.unsubscribe();
    this._select.removeEventListener('focus', this._onFocus);
    this._select.removeEventListener('input', this._onInput);
    this.touched.complete();
    this.formControlValueChange.complete();
  }

  private readonly _onFocus = () => {
    this.touched.emit();
  };

  private _onInput = (): void => {
    this.formControlValue =
      this._select.selectedOptions.length > 0 ? this._optionsService.getValue(this._select.selectedOptions[0]) : null;
  };

  private _onOptionChanged = (option: HTMLOptionElement): void => {
    option.selected = this._optionsService.getValue(option) === this._formControlValue;
  };
}
