import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CoreWrapperComponent } from './components';

const routes: Routes = [
  {
    path: '',
    component: CoreWrapperComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoreRoutingModule {}
