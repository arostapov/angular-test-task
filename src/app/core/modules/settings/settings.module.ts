import { NgModule } from '@angular/core';

import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsWrapperComponent } from './components';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { InputDirective } from '../../../shared/modules/custom-input/directives';
import { ReactiveFormsModule } from '@angular/forms';
import {
  NgbDropdown,
  NgbDropdownItem,
  NgbDropdownMenu,
  NgbDropdownToggle,
} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [SettingsWrapperComponent],
  imports: [
    SettingsRoutingModule,
    AsyncPipe,
    NgIf,
    InputDirective,
    NgForOf,
    ReactiveFormsModule,
    NgbDropdown,
    NgbDropdownToggle,
    NgbDropdownMenu,
    NgbDropdownItem,
  ],
})
export class SettingsModule {}
