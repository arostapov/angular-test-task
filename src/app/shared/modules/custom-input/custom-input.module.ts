import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { InputDirective } from './directives';

@NgModule({
  imports: [InputDirective],
  exports: [ReactiveFormsModule, FormsModule, InputDirective],
})
export class CustomInputModule {}
