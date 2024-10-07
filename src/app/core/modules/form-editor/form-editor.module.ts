import { NgModule } from '@angular/core';
import { AsyncPipe, NgClass, NgForOf, NgIf } from '@angular/common';

import { FormEditorRoutingModule } from './form-editor-routing.module';
import { MultiFormContainerComponent } from './components';
import { CardComponent, InfoFormComponent } from '../../../shared/components';
import { InvalidFormsPipe } from '../../../shared/pipes';

@NgModule({
  declarations: [MultiFormContainerComponent],
  imports: [
    FormEditorRoutingModule,
    InfoFormComponent,
    CardComponent,
    NgForOf,
    NgIf,
    InvalidFormsPipe,
    AsyncPipe,
    NgClass,
  ],
})
export class FormEditorModule {}
