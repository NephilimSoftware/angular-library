import {forwardRef, Directive, ElementRef, EventEmitter, Input, OnDestroy, Output} from '@angular/core';
import {Subscription} from 'rxjs';
import {IFormControlComponent} from '../components/form-control.component';
import {FORM_CONTROL_COMPONENT} from '../forms.injectables';
import {hasTheSameItems} from '../model/array';
import {OptionsService} from '../services/options.service';

@Directive({
  selector: 'select[[formControl]][multiple]',
  providers: [
    {
      provide: FORM_CONTROL_COMPONENT,
      useExisting: forwardRef(() => SelectMultipleDirective),
    },
    OptionsService,
  ],
})
export class SelectMultipleDirective<TValue> implements IFormControlComponent<TValue[]>, OnDestroy {
  private readonly _select: HTMLSelectElement = this._elementRef.nativeElement;

  private _formControlValue: TValue[] = [];
  @Input()
  public get formControlValue(): TValue[] {
    return this._formControlValue;
  }

  public set formControlValue(value: TValue[]) {
    const previousValue: TValue[] = this.formControlValue;
    if (!hasTheSameItems(previousValue, value)) {
      this._formControlValue = value;
      const options: HTMLOptionsCollection = this._select.options;
      for (let i: number = 0; i < options.length; i++) {
        this._onOptionChanged(options[i]);
      }

      this.formControlValueChange.emit(this._formControlValue);
    }
  }

  @Input()
  public set isDisabled(value: boolean) {
    this._select.disabled = value;
  }

  @Output()
  public readonly touched: EventEmitter<void> = new EventEmitter<void>();

  @Output()
  public readonly formControlValueChange: EventEmitter<TValue[]> = new EventEmitter<TValue[]>();

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
    const selectedOptions: HTMLCollectionOf<HTMLOptionElement> = this._select.selectedOptions;
    const value: TValue[] = [];
    for (let i: number = 0; i < selectedOptions.length; i++) {
      const selectedValue: TValue | null = this._optionsService.getValue(selectedOptions[i]);
      if (selectedValue) {
        value.push(selectedValue);
      }
    }
    this.formControlValue = value;
  };

  private _onOptionChanged = (option: HTMLOptionElement): void => {
    const optionValue: TValue | null = this._optionsService.getValue(option);
    option.selected = optionValue !== null && this._formControlValue.indexOf(optionValue) > -1;
  };
}
