import {coerceBooleanProperty} from '@angular/cdk/coercion';
import {
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  OnDestroy,
  Optional,
  Output,
  QueryList,
  Self,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import {ControlValueAccessor, FormControl, NgControl} from '@angular/forms';
import {MatAutocompleteSelectedEvent, MatAutocompleteTrigger} from '@angular/material/autocomplete';
import {MatOption} from '@angular/material/core';
import {MatFormField, MatFormFieldControl} from '@angular/material/form-field';
import {currentValue} from '@nephilimSoftwarePackages/reactive-forms';
import {Observable, Subscription} from 'rxjs';
import {map, shareReplay} from 'rxjs/operators';

type OnChanged = <TValue>(value: TValue) => void;
type OnTouched = () => void;

@Component({
  selector: 'app-combo-box',
  templateUrl: 'combo-box.component.html',
  styleUrls: ['combo-box.component.scss'],
  providers: [{provide: MatFormFieldControl, useExisting: ComboBoxComponent}],
})
export class ComboBoxComponent<TOption>
  implements MatFormFieldControl<TOption | null>, ControlValueAccessor, OnDestroy
{
  private static _uniqueId: number = 0;
  private static _createUniqueId(): string {
    return `app-combo-box-${ComboBoxComponent._uniqueId++}`;
  }

  @ViewChild(MatAutocompleteTrigger, {read: MatAutocompleteTrigger})
  public autocompleteTrigger!: MatAutocompleteTrigger;

  public readonly queryControl: FormControl = new FormControl('');

  public readonly query: Observable<string> = currentValue(this.queryControl).pipe(
    map((value) => (typeof value === 'string' ? value : this.formatOption(value))),
    map((value) => value.toLowerCase()),
    shareReplay(1)
  );

  @ViewChild('queryInput', {static: true})
  public queryInput!: ElementRef<HTMLInputElement>;

  @ViewChildren(MatOption, {read: ElementRef})
  public optionElementRefs!: QueryList<ElementRef>;

  @Input()
  public value: TOption | null = null;
  @Output()
  public valueChange: EventEmitter<TOption | null> = new EventEmitter<TOption | null>();

  @Input()
  public options: TOption[] = [];

  @Input()
  public displayWith: ((value: TOption) => string) | null = null;

  @Input()
  public noResultsMessage: string = '';

  @Input()
  public isLoading: boolean = false;

  private _placeholder: string = '';
  @Input()
  public get placeholder(): string {
    return this._placeholder;
  }
  public set placeholder(value: string) {
    this._placeholder = value;
    this.stateChanges.emit();
  }

  private _userAriaDescribedBy: string | undefined = undefined;
  @Input('aria-describedby')
  public get userAriaDescribedBy(): string | undefined {
    return this._userAriaDescribedBy;
  }

  public readonly controlType: string = 'mat-form-field--combo-box';

  private _focused: boolean = false;
  public get focused(): boolean {
    return this._focused;
  }

  public get empty(): boolean {
    return !this.value;
  }

  public get errorState(): boolean {
    return (this.ngControl.control?.touched ?? false) && (this.ngControl.control?.invalid ?? false);
  }

  private _required: boolean = false;
  @Input()
  public get required(): boolean {
    return this._required;
  }
  public set required(value: boolean) {
    this._required = coerceBooleanProperty(value);
    this.stateChanges.emit();
  }

  private _disabled: boolean = false;
  @Input()
  public get disabled(): boolean {
    return this._disabled;
  }
  public set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
    if (this._disabled) {
      this.queryControl.disable();
    } else {
      this.queryControl.enable();
    }
    this.stateChanges.emit();
  }

  @HostBinding('class.app-combo-box--floating')
  public get shouldLabelFloat(): boolean {
    return this.focused || !this.empty;
  }

  @HostBinding()
  public readonly id: string = ComboBoxComponent._createUniqueId();

  @Output()
  public readonly stateChanges: EventEmitter<void> = new EventEmitter<void>();

  private _onChanged: OnChanged | null = null;
  private _onTouched: OnTouched | null = null;

  private readonly _subscriptions: Subscription[] = [
    this.valueChange.subscribe(() => {
      if (this._onChanged) {
        this._onChanged(this.value);
      }
    }),
  ];

  public constructor(
    private readonly _elementRef: ElementRef,
    @Optional() @Self() public readonly ngControl: NgControl,
    @Optional() public readonly parentFormField: MatFormField
  ) {
    if (this.ngControl !== null) {
      this.ngControl.valueAccessor = this;
    }
  }

  public ngOnDestroy(): void {
    this._subscriptions.forEach((s) => s.unsubscribe());
  }

  public onOptionSelected(event: MatAutocompleteSelectedEvent): void {
    this.setValue(event.option.value);
    this.stateChanges.emit();
  }

  public readonly formatOption = (option: TOption | null): string => {
    if (!option) {
      return '';
    }
    return this.displayWith ? this.displayWith(option) : `${option}`;
  };

  public onFocusIn(event: FocusEvent): void {
    if (!this.focused) {
      this._focused = true;
      if (this._onTouched) {
        this._onTouched();
      }
      this.stateChanges.emit();
      this.autocompleteTrigger.openPanel();
    }
  }

  public onFocusOut(event: FocusEvent): void {
    if (!this.optionElementRefs.find((v) => v.nativeElement === event.relatedTarget)) {
      this._focused = false;
      this.setValue(this._getFirstQueriedOption());
      this.stateChanges.emit();
    } else {
      event.stopImmediatePropagation();
      event.preventDefault();
      this.queryInput.nativeElement.focus();
    }
  }

  public onClicked(): void {
    this.autocompleteTrigger.openPanel();
  }

  public onClearClicked(): void {
    this.setValue(null);
  }

  public setDescribedByIds(ids: string[]): void {
    this._userAriaDescribedBy = ids.join(' ');
  }

  public onContainerClick(event: MouseEvent): void {
    if (event.target !== this.queryInput.nativeElement) {
      event.stopPropagation();
      this.queryInput.nativeElement.focus();
    }
  }

  public registerOnChange(onChanged: OnChanged): void {
    this._onChanged = onChanged;
  }

  public registerOnTouched(onTouched: OnTouched): void {
    this._onTouched = onTouched;
  }

  public setDisabledState(isDisabled: boolean): void {
    this._disabled = isDisabled;
  }

  public setValue(value: TOption | null): void {
    const previousValue: TOption | null = this.value;
    this.writeValue(value);
    if (this.value !== previousValue) {
      this.valueChange.emit();
    }
  }

  public writeValue(value: TOption | null): void {
    this.value = value ?? null;
    this.queryControl.setValue(value);
  }

  private _getFirstQueriedOption(): TOption | null {
    if (typeof this.queryControl.value !== 'string') {
      return this.queryControl.value;
    }

    const query: string = this.queryControl.value?.toLowerCase();
    return query
      ? this.options.find((option) => this.formatOption(option).toLowerCase().indexOf(query) > -1) ?? null
      : null;
  }
}
