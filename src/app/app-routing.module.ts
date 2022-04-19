import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  {
    path: 'forms',
    loadChildren: (): any => import('./forms/app-forms.module').then((m) => m.AppFormsModule),
  },
  {
    path: 'theme',
    loadChildren: (): any => import('./theme/app-theme.module').then((m) => m.AppThemeModule),
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
