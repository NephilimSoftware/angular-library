import {Component} from '@angular/core';
import {FormControl} from '@angular/forms';

@Component({
  templateUrl: 'theme.page.html'
})
export class ThemePage {
  public readonly control: FormControl = new FormControl();
}
