import {Directive, ElementRef, Input, OnDestroy, Optional} from '@angular/core';
import {OptionsService} from '../services/options.service';

export interface IOptionDirective<TValue> {
  value: TValue | null;
}

@Directive({
  selector: 'option',
})
export class OptionDirective<TValue> implements IOptionDirective<TValue>, OnDestroy {
  private readonly _option: HTMLOptionElement;

  public _value: TValue | null = null;
  @Input()
  public get value(): TValue | null {
    return this._value;
  }
  public set value(value: TValue | null) {
    if (value !== this.value) {
      this._value = value;
      this._optionsService?.optionChanged.emit(this._option);
    }
  }

  constructor(
    @Optional() private _optionsService: OptionsService<TValue>,
    elementRef: ElementRef
  ) {
    this._option = elementRef.nativeElement;
    this._optionsService?.add(this._option, this);
  }

  public ngOnDestroy(): void {
    this._optionsService?.remove(this._option);
    this._optionsService = <any>undefined;
  }
}
