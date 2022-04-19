import {Component, EventEmitter, HostListener, Output} from '@angular/core';

@Component({
  selector: 'app-popup',
  templateUrl: 'popup.component.html',
  styleUrls: ['popup.component.scss'],
})
export class PopupComponent {
  @Output()
  public closeRequested: EventEmitter<void> = new EventEmitter<void>();

  @HostListener('click', ['$event'])
  public onClicked(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.onCloseClicked();
    }
  }

  public onCloseClicked(): void {
    this.closeRequested.emit();
  }
}
