export class FormPropertyChangedEvent<TValue> {
  constructor(public readonly previousValue: TValue, public readonly currentValue: TValue) {}

  public toString(): string {
    return `[FormPropertyChangedEvent previousValue="${this.previousValue}" currentValue="${this.currentValue}"]`;
  }
}
