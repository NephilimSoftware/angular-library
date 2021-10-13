import {IFormControl} from '../model/api';

export class FormControlArrayItemAddedEvent<TItemValue> {
  constructor(public readonly item: IFormControl<TItemValue>) {}

  public toString(): string {
    return `[FormArrayItemAddedEvent item="${this.item}"]`;
  }
}
