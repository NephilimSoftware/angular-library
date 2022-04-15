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
import {MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipModule} from '@angular/material/tooltip';
import {CaptionComponent} from './components/caption/caption.component';
import {HeadingComponent} from './components/heading/heading.component';
import {LabelComponent} from './components/label/label.component';
import {LayoutComponent} from './components/layout/layout.component';
import {LayoutItemComponent} from './components/layout-item/layout-item.component';
import {ParagraphComponent} from './components/paragraph/paragraph.component';
import {ColumnDirective} from './directives/column.directive';

const imports: any[] = [
  CommonModule,
  MatAutocompleteModule,
  MatButtonModule,
  MatIconModule,
  MatInputModule,
  MatOptionModule,
  MatProgressSpinnerModule,
  MatSelectModule,
  MatTooltipModule,
  ReactiveFormsModule,
];
const components: Type<any>[] = [
  CaptionComponent,
  HeadingComponent,
  LabelComponent,
  LayoutComponent,
  LayoutItemComponent,
  ParagraphComponent,
];
const pipes: Type<any>[] = [];
const services: Type<any>[] = [];
const directives: Type<any>[] = [ColumnDirective];

const providers: Provider[] = [
  {
    provide: MAT_TOOLTIP_DEFAULT_OPTIONS,
    useValue: {position: 'above'},
  },
  {
    provide: MAT_PROGRESS_SPINNER_DEFAULT_OPTIONS,
    useValue: {diameter: 16},
  },
];

@NgModule({
  declarations: [...components, ...directives, ...pipes],
  imports: [...imports],
  exports: [...imports, ...components, ...directives, ...pipes],
  providers: [...services, ...providers],
})
export class ThemeModule {}
