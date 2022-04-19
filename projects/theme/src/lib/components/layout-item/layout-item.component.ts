import {Component, HostBinding} from '@angular/core';

@Component({
  selector: 'app-layout-item',
  templateUrl: 'layout-item.component.html',
  styleUrls: ['layout-item.component.scss'],
})
export class LayoutItemComponent {
  @HostBinding('class.o-layout__item')
  public readonly cssClass: boolean = true;
}
