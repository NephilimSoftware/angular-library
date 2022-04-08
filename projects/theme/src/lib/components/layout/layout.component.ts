import {Component, HostBinding, Input} from '@angular/core';

@Component({
  selector: 'app-layout',
  templateUrl: 'layout.component.html',
  styleUrls: ['layout.component.scss'],
})
export class LayoutComponent {
  @HostBinding('class.o-layout')
  public cssClass: boolean = true;

  @HostBinding('class.o-layout--spaced')
  @Input()
  public isSpaced: boolean = false;

  @HostBinding('class.o-layout--single-row')
  @Input()
  public isSingleRow: boolean = false;

  @HostBinding('class.o-layout--centered')
  @Input()
  public isCentered: boolean = false;

  @HostBinding('class.o-layout--vertically-centered')
  @Input()
  public isVerticallyCentered: boolean = false;

  @HostBinding('class.o-layout--list')
  @Input()
  public isList: boolean = false;
}
