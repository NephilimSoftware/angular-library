import {forwardRef, Directive, ElementRef, EventEmitter, Input, OnDestroy, Output} from '@angular/core';
import {IFormControlComponent} from '../components/form-control.component';
import {InputTypeNotSupportedError} from '../errors/input-type-not-supported.error';
import {FORM_CONTROL_COMPONENT} from '../forms.injectables';
import {InputType} from '../model/input-type';
import {InputValue} from '../model/input-value';
import {CheckboxStrategy} from '../model/input-value-strategies/checkbox-strategy';
import {DateStrategy} from '../model/input-value-strategies/date-strategy';
import {FileStrategy} from '../model/input-value-strategies/file-strategy';
import {IInputValueStrategy} from '../model/input-value-strategies/input-value-strategy';
import {LocalDateStrategy} from '../model/input-value-strategies/local-date-strategy';
import {NumberStrategy} from '../model/input-value-strategies/number-strategy';
import {TextStrategy} from '../model/input-value-strategies/text-strategy';

@Directive({
  selector: 'input[[formControl]]:not([type=radio])',
  providers: [
    {
      provide: FORM_CONTROL_COMPONENT,
      useExisting: forwardRef(() => InputDirective),
    },
  ],
})
export class InputDirective implements IFormControlComponent<InputValue>, OnDestroy {
  private static readonly _strategies: {[inputType in InputType]: IInputValueStrategy | null} = {
    search: new TextStrategy(),
    text: new TextStrategy(),
    url: new TextStrategy(),
    tel: new TextStrategy(),
    color: new TextStrategy(),
    date: new DateStrategy(),
    week: new DateStrategy(),
    month: new DateStrategy(),
    time: new DateStrategy(),
    'datetime-local': new LocalDateStrategy(),
    email: new TextStrategy(),
    checkbox: new CheckboxStrategy(),
    password: new TextStrategy(),
    file: new FileStrategy(),
    number: new NumberStrategy(),
    range: new NumberStrategy(),
    radio: null,
    image: null,
    button: null,
    reset: null,
    submit: null,
    hidden: null,
  };

  private static getValueStrategy(type: InputType): IInputValueStrategy {
    const strategy: IInputValueStrategy | null = InputDirective._strategies[type];
    if (!strategy) {
      throw new InputTypeNotSupportedError(type);
    }

    return strategy;
  }

  private readonly _input: HTMLInputElement = this._elementRef.nativeElement;

  private _valueStrategy: IInputValueStrategy = InputDirective.getValueStrategy(this.type);

  @Input()
  public get formControlValue(): InputValue {
    return this._valueStrategy.get(this._input);
  }
  public set formControlValue(value: InputValue) {
    value = this._valueStrategy.validate(value);
    if (!this._valueStrategy.isEqual(this.formControlValue, value)) {
      this._valueStrategy.set(this._input, value);
      this._onInput();
    }
  }

  @Input()
  public set isDisabled(value: boolean) {
    this._input.disabled = value;
  }

  @Input()
  public get type(): InputType {
    return <InputType>this._input.type;
  }
  public set type(value: InputType) {
    if (this.type !== value) {
      const currentValue: InputValue = this.formControlValue;
      this._valueStrategy = InputDirective.getValueStrategy(value);
      this._input.type = value;
      this.formControlValue = currentValue;
    }
  }

  @Output()
  public readonly touched: EventEmitter<void> = new EventEmitter<void>();

  @Output()
  public readonly formControlValueChange: EventEmitter<InputValue> = new EventEmitter<InputValue>();

  public constructor(private readonly _elementRef: ElementRef) {
    this._input.addEventListener('input', this._onInput);
    this._input.addEventListener('focus', this._onFocus);
  }

  public ngOnDestroy(): void {
    this._input.removeEventListener('focus', this._onFocus);
    this._input.removeEventListener('input', this._onInput);
    this.touched.complete();
    this.formControlValueChange.complete();
  }

  private readonly _onFocus = () => {
    this.touched.emit();
  };

  private _onInput = (): void => {
    const value: InputValue = this.formControlValue;
    if (this._valueStrategy.canBeDispatched(value)) {
      this.formControlValueChange.emit(value);
    }
  };
}
