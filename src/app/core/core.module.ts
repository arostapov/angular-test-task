import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreRoutingModule } from './core-routing.module';
import { CoreWrapperComponent } from './components';
import { NgbNav, NgbNavItem, NgbNavLink } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [CoreWrapperComponent],
  imports: [CommonModule, CoreRoutingModule, NgbNav, NgbNavItem, NgbNavLink],
})
export class CoreModule {}
