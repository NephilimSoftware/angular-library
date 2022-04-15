/* eslint-disable @typescript-eslint/no-explicit-any */
import {CommonModule} from '@angular/common';
import {NgModule, Provider, Type} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatButtonModule} from '@angular/material/button';
import {MatOptionModule} from '@angular/material/core';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MAT_PROGRESS_SPINNER_DEFAULT_OPTIONS, MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSelectModule} from '@angular/material/select';
import {ComboBoxComponent} from './components/combo-box/combo-box.component';
import {ComboBoxSearchDirective} from './directives/combo-box-search.directive';
import {ThemeModule} from '@nephilimsoftware/theme'

const imports: any[] = [
  CommonModule,
  MatAutocompleteModule,
  MatButtonModule,
  MatIconModule,
  MatInputModule,
  MatOptionModule,
  MatProgressSpinnerModule,
  MatSelectModule,
  ReactiveFormsModule,
  ThemeModule
];
const components: Type<any>[] = [ComboBoxComponent];

const directives: Type<any>[] = [ComboBoxSearchDirective];

const providers: Provider[] = [
  {
    provide: MAT_PROGRESS_SPINNER_DEFAULT_OPTIONS,
    useValue: {diameter: 16},
  },
];

@NgModule({
  declarations: [...components, ...directives],
  imports: [...imports],
  exports: [...imports, ...components, ...directives],
  providers: [...providers],
})
export class ComboBoxModule {}
