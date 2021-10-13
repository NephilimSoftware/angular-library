import {IFormControl} from '../model/api';

export class FormControlArrayItemRemovedEvent<TItemValue> {
  constructor(public readonly item: IFormControl<TItemValue>) {}

  public toString(): string {
    return `[FormArrayItemRemovedEvent item="${this.item}"]`;
  }
}
