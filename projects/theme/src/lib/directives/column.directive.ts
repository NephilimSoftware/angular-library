import {Directive, HostBinding, Input} from '@angular/core';

export type ColumnSize = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 'grow';

@Directive({
  selector: '[[col]],[[col_s]],[[col_m]],[[col_l]],[[col_xl]]',
})
export class ColumnDirective {
  @HostBinding('class')
  public cssClass!: string;

  private _col: ColumnSize | null = null;
  @Input()
  public set col(value: ColumnSize | null) {
    this._col = value;
    this._updateCssClass();
  }

  private _col_s: ColumnSize | null = null;
  @Input()
  public set col_s(value: ColumnSize | null) {
    this._col_s = value;
    this._updateCssClass();
  }

  private _col_m: ColumnSize | null = null;
  @Input()
  public set col_m(value: ColumnSize | null) {
    this._col_m = value;
    this._updateCssClass();
  }

  private _col_l: ColumnSize | null = null;
  @Input()
  public set col_l(value: ColumnSize | null) {
    this._col_l = value;
    this._updateCssClass();
  }

  private _col_xl: ColumnSize | null = null;
  @Input()
  public set col_xl(value: ColumnSize | null) {
    this._col_xl = value;
    this._updateCssClass();
  }

  public constructor() {
    this._updateCssClass();
  }

  private _updateCssClass(): void {
    this.cssClass = [
      this._col ? `u-width--col-${this._col}` : null,
      this._col_s ? `u-width--col-${this._col_s}---s` : null,
      this._col_m ? `u-width--col-${this._col_m}---m` : null,
      this._col_l ? `u-width--col-${this._col_l}---l` : null,
      this._col_xl ? `u-width--col-${this._col_xl}---xl` : null,
    ]
      .filter((cssClass) => cssClass !== null)
      .join(' ');
  }
}
