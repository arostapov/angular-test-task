import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormGroup } from '@angular/forms';
import {
  NgbDateAdapter,
  NgbDateParserFormatter,
  NgbDateStruct,
  NgbInputDatepicker,
} from '@ng-bootstrap/ng-bootstrap';

import { CustomInputModule, MatchingDropdownModule } from '../../modules';
import { CustomDateAdapter, CustomDateParserFormatter } from '../../helpers';
import { InputValidatorDirective } from '../../directives';
import { InfoForm, ShowOn } from '../../interface';

@Component({
  selector: 'app-info-form',
  templateUrl: './info-form.component.html',
  styleUrl: './info-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CustomInputModule,
    NgbInputDatepicker,
    NgIf,
    MatchingDropdownModule,
    InputValidatorDirective,
  ],
  providers: [
    { provide: NgbDateAdapter, useClass: CustomDateAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
  ],
})
export class InfoFormComponent {
  date = new Date();
  showOn: ShowOn = 'input';

  @Input()
  form?: FormGroup<InfoForm>;

  @Input()
  countries: string[] = [];

  get ngbDate(): NgbDateStruct {
    return {
      day: this.date.getUTCDate(),
      month: this.date.getUTCMonth() + 1,
      year: this.date.getUTCFullYear(),
    };
  }
}
