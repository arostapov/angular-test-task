import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreRoutingModule } from './core-routing.module';
import { CoreWrapperComponent } from './components';

@NgModule({
  declarations: [CoreWrapperComponent],
  imports: [CommonModule, CoreRoutingModule],
})
export class CoreModule {}
