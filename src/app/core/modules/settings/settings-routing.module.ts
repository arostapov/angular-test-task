import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SettingsWrapperComponent } from './components';

const routes: Routes = [
  {
    path: '',
    component: SettingsWrapperComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsRoutingModule {}
