import {EventEmitter, Injectable, OnDestroy} from '@angular/core';
import {IOptionDirective} from '../directives/option.directive';
import {OptionAlreadyAddedError} from '../errors/option-already-added.error';

class Entry<TValue> {
  constructor(public readonly option: HTMLOptionElement, public readonly directive: IOptionDirective<TValue>) {}
}

@Injectable()
export class OptionsService<TValue> implements OnDestroy {
  private _entries: Entry<TValue>[] = [];

  public readonly optionChanged: EventEmitter<HTMLOptionElement> = new EventEmitter<HTMLOptionElement>();

  public getValue(option: HTMLOptionElement): TValue | null {
    return this._getEntry(option)?.directive.value ?? null;
  }

  public add(option: HTMLOptionElement, directive: IOptionDirective<TValue>): void {
    if (this._getEntry(option)) {
      throw new OptionAlreadyAddedError();
    }

    this._entries.push(new Entry(option, directive));
  }

  public remove(option: HTMLOptionElement): void {
    this._entries = this._entries.filter(entry => entry.option !== option);
  }

  private _getEntry(option: HTMLOptionElement): Entry<TValue> | undefined {
    return this._entries.find((entry) => entry.option === option);
  }

  public ngOnDestroy(): void {
    this._entries = [];
  }
}
