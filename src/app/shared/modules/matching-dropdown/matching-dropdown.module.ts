import { NgModule } from '@angular/core';

import { MatchingDropdownDirective } from './directives';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { ArrayFilterPipe } from '../../pipes';
import { MatchingListWrapperComponent } from './components';

@NgModule({
  declarations: [MatchingDropdownDirective, MatchingListWrapperComponent],
  imports: [NgForOf, ArrayFilterPipe, AsyncPipe, NgIf],
  exports: [MatchingDropdownDirective],
})
export class MatchingDropdownModule {}
