import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ThemePage} from '@app/theme/pages/theme/theme.page';

const routes: Routes = [
  {
    path: '',
    component: ThemePage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ThemeRoutingModule {}
