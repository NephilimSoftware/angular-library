export class PropertySubjectChangingEvent<TValue> {
  private _error: Error | null = null;
  public get error(): Error | null {
    return this._error;
  }

  private _wasCancelled: boolean = false;
  public get wasCancelled(): boolean {
    return this._wasCancelled;
  }

  public constructor(public readonly previousValue: TValue, public readonly currentValue: TValue) {}

  public cancel(): void {
    this._wasCancelled = true;
  }

  public cancelAndThrow(error: Error): void {
    this._wasCancelled = true;
    this._error = error;
  }

  public toString(): string {
    return `[PropertySubjectChangingEvent wasCanceled="${this.wasCancelled}" previousValue="${this.previousValue}" currentValue="${this.currentValue}"]`;
  }
}
