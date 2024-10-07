import { NgModule } from '@angular/core';
import { AsyncPipe, NgClass, NgForOf, NgIf } from '@angular/common';

import { FormEditorRoutingModule } from './form-editor-routing.module';
import { MultiFormContainerComponent } from './components';
import { InfoFormComponent } from './components/multi-form-container/components';
import { CardComponent } from '../../../shared/components';
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
