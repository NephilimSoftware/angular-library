export class PropertySubjectChangedEvent<TValue> {
  public constructor(public readonly previousValue: TValue, public readonly currentValue: TValue) {}

  public toString(): string {
    return `[PropertySubjectChangedEvent previousValue="${this.previousValue}" currentValue="${this.currentValue}"]`;
  }
}
