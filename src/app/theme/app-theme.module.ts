import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {ThemePage} from '@app/theme/pages/theme/theme.page';
import {ThemeRoutingModule} from '@app/theme/theme-routing.module';
import {ThemeModule} from '@nephilimsoftware/theme';

const components: any[] = [];
const pages: any[] = [ThemePage];
const pipes: any[] = [];

@NgModule({
  declarations: [...components, ...pages, ...pipes],
  imports: [CommonModule, MatFormFieldModule, ThemeModule, ThemeRoutingModule],
  exports: [...components, ...pages, ...pipes],
})
export class AppThemeModule {}
