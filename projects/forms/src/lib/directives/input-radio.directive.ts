import {forwardRef, Directive, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {IFormControlComponent} from '../components/form-control.component';
import {FORM_CONTROL_COMPONENT} from '../forms.injectables';
import {RadioButtonGroupService} from '../services/radio-button-group.service';
import {IRadioButtonDirective} from './radio-button.directive';

@Directive({
  selector: 'input[[formControl]][type=radio]',
  providers: [
    {
      provide: FORM_CONTROL_COMPONENT,
      useExisting: forwardRef(() => InputRadioDirective),
    },
  ],
})
export class InputRadioDirective<TValue> implements IFormControlComponent<TValue | null>, IRadioButtonDirective<TValue>, OnInit, OnDestroy {
  private readonly _input: HTMLInputElement = this._elementRef.nativeElement;

  @Input()
  public value: TValue | null = null;

  private _initialFormControlValue: TValue | null = null;

  @Input()
  public get formControlValue(): TValue | null {
    return this._groupService.getValue(this.name);
  }
  public set formControlValue(value: TValue | null) {
    this._setValue(value);
  }

  private _name: string = '';
  @Input()
  public get name(): string {
    return this._name;
  }
  public set name(value: string) {
    if (this.name !== value) {
      this._groupService.remove(this);
      this._name = value;
      this._groupService.add(value, this);
    }
  }

  @Input()
  public set isDisabled(value: boolean) {
    this._input.disabled = value;
  }

  @Output()
  public readonly touched: EventEmitter<void> = new EventEmitter<void>();

  @Output()
  public readonly formControlValueChange: EventEmitter<TValue | null> = new EventEmitter<TValue | null>();

  public get isSelected(): boolean {
    return this._input.checked;
  }
  public set isSelected(value: boolean) {
    this._input.checked = value;
  }

  public constructor(
    private readonly _groupService: RadioButtonGroupService<TValue>,
    private readonly _elementRef: ElementRef
  ) {
    this._groupService.add(this.name, this);
    this._input.addEventListener('click', this._onClick);
    this._input.addEventListener('focus', this._onFocus);
  }

  public ngOnInit(): void {
    this._setValue = (value: TValue | null) => {
      if (this._groupService.setValue(this.name, value)) {
        this._onClick();
      }
    };
    this.formControlValue = this._initialFormControlValue;
  }

  public ngOnDestroy(): void {
    this._groupService.remove(this);
    this._input.removeEventListener('focus', this._onFocus);
    this._input.removeEventListener('click', this._onClick);
    this.touched.complete();
    this.formControlValueChange.complete();
  }

  private _setValue: (value: TValue | null) => void = (value) => {
    this._initialFormControlValue = value;
  };

  private readonly _onFocus = () => {
    this.touched.emit();
  };

  private _onClick = (): void => {
    this.formControlValueChange.emit(this.formControlValue);
  };
}
