import {Component, Input} from '@angular/core';

type BoxColor = 'red' | 'green' | 'blue' | 'yellow';

@Component({
  selector: 'app-box',
  templateUrl: 'box.component.html',
  styleUrls: ['box.component.scss'],
})
export class BoxComponent {
  @Input() public color: BoxColor = 'red';
}
