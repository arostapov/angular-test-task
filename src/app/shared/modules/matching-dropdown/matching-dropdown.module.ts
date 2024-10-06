import { NgModule } from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';

import { MatchingDropdownDirective } from './directives';

@NgModule({
  imports: [MatchingDropdownDirective, OverlayModule, PortalModule],
  exports: [MatchingDropdownDirective],
})
export class MatchingDropdownModule {}
