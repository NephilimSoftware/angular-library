import {Component} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Component({
  templateUrl: 'theme.page.html',
})
export class ThemePage {
  private readonly _isPopupVisible: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public readonly isPopupVisible = this._isPopupVisible;

  public onOpenPopupRequested(): void {
    this._isPopupVisible.next(true);
  }

  public onClosePopupRequested(): void {
    this._isPopupVisible.next(false);
  }
}
