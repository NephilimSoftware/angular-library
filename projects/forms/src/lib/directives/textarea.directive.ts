import {forwardRef, Directive, ElementRef, EventEmitter, Input, OnDestroy, Output} from '@angular/core';
import {IFormControlComponent} from '../components/form-control.component';
import {FORM_CONTROL_COMPONENT} from '../forms.injectables';

@Directive({
  selector: 'textarea[[formControl]]',
  providers: [
    {
      provide: FORM_CONTROL_COMPONENT,
      useExisting: forwardRef(() => TextareaDirective),
    },
  ],
})
export class TextareaDirective implements IFormControlComponent<string>, OnDestroy {
    private readonly _textarea: HTMLTextAreaElement = this._elementRef.nativeElement;

  @Input()
  public get formControlValue(): string {
    return this._textarea.value;
  }

  public set formControlValue(value: string) {
    if (this.formControlValue !== value) {
      this._textarea.value = value;
      this._onInput();
    }
  }

  @Input()
  public set isDisabled(value: boolean) {
    this._textarea.disabled = value;
  }

  @Output()
  public readonly touched: EventEmitter<void> = new EventEmitter<void>();

  @Output()
  public readonly formControlValueChange: EventEmitter<string> = new EventEmitter<string>();

  public constructor(private readonly _elementRef: ElementRef) {
    this._textarea.addEventListener('input', this._onInput);
    this._textarea.addEventListener('focus', this._onFocus);
  }

  public ngOnDestroy(): void {
    this._textarea.removeEventListener('focus', this._onFocus);
    this._textarea.removeEventListener('input', this._onInput);
    this.touched.complete();
    this.formControlValueChange.complete();
  }

  private readonly _onFocus = () => {
    this.touched.emit();
  };

  private _onInput = (): void => {
    this.formControlValueChange.emit(this.formControlValue);
  };
}
