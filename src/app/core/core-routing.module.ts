import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CoreWrapperComponent } from './components';

const routes: Routes = [
  {
    path: '',
    component: CoreWrapperComponent,
    children: [
      {
        path: 'form-editor',
        loadChildren: () =>
          import('./modules/form-editor/form-editor.module').then((m) => m.FormEditorModule),
      },
      {
        path: '**',
        redirectTo: 'form-editor',
      },
    ],
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
