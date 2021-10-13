import {Injectable, OnDestroy} from '@angular/core';
import {IRadioButtonDirective} from '../directives/radio-button.directive';
import {RadioButtonAlreadyAddedError} from '../errors/radio-button-already-added.error';

@Injectable()
export class RadioButtonGroupService<TValue> implements OnDestroy {
  private readonly _groups: {[name: string]: IRadioButtonDirective<TValue>[]} = {};

  public getValue(name: string): TValue | null {
    return this._groups[name]?.find((radioButton) => radioButton.isSelected)?.value ?? null;
  }

  public setValue(name: string, value: TValue | null): boolean {
    const previousValue: TValue | null = this.getValue(name);
    this._groups[name]?.forEach((radioButton) => {
      radioButton.isSelected = radioButton.value === value;
    });
    return previousValue !== this.getValue(name);
  }

  public add(name: string, radioButton: IRadioButtonDirective<TValue>): void {
    const currentGroupName: string | null = this._getRadioButtonGroupName(radioButton);
    if (currentGroupName !== null) {
      throw new RadioButtonAlreadyAddedError(currentGroupName);
    }
    if (!this._groups[name]) {
      this._groups[name] = [];
    }

    this._groups[name].push(radioButton);
  }

  public remove(radioButton: IRadioButtonDirective<TValue>): void {
    const name: string | null = this._getRadioButtonGroupName(radioButton);
    if (name !== null) {
      this._groups[name] = this._groups[name].filter((button) => button !== radioButton);
    }
  }

  private _getRadioButtonGroupName(radioButton: IRadioButtonDirective<TValue>): string | null {
    return Object.keys(this._groups).find((name) => this._groups[name].indexOf(radioButton) > -1) ?? null;
  }

  public ngOnDestroy(): void {
    Object.keys(this._groups).map((key) => {
      delete this._groups[key];
    });
  }
}
