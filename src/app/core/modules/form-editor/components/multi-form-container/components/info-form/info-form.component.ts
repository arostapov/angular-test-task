import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormGroup } from '@angular/forms';
import {
  NgbDateAdapter,
  NgbDateParserFormatter,
  NgbDateStruct,
  NgbInputDatepicker,
} from '@ng-bootstrap/ng-bootstrap';
import { CustomInputModule } from '../../../../../../../shared/modules';
import { InputDirective } from '../../../../../../../shared/modules/custom-input/directives';
import { MatchingDropdownDirective } from '../../../../../../../shared/modules/matching-dropdown/directives';
import { InfoForm } from '../../../../../../../shared/interface';
import { CustomDateAdapter, CustomDateParserFormatter } from '../../../../../../../shared/helpers';
import { ShowOn } from '../../../../../../../shared/type';
import { InputValidatorDirective } from '../../../../../../../shared/directives';

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
    InputDirective,
    MatchingDropdownDirective,
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
