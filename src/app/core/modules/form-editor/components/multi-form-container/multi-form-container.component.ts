import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

import { InfoForm } from '../../../../../shared/interface';
import { CountriesValidator, UsernameValidator } from '../../../../../shared/helpers';
import { Country } from '../../../../../shared/enum/country';
import { FormEditorService } from '../../services';

@Component({
  selector: 'app-multi-form',
  templateUrl: './multi-form-container.component.html',
  styleUrl: './multi-form-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultiFormContainerComponent {
  private _formEditorService: FormEditorService = inject(FormEditorService);

  maxForms: number = 10;
  countries = Object.keys(Country);
  formArray: FormArray<FormGroup<InfoForm>> = new FormArray([this._getNewFormGroup()]);

  get formArrayControls(): FormGroup<InfoForm>[] {
    return this.formArray.controls;
  }

  formTrackBy(index: number, _: FormGroup<InfoForm>) {
    return 'form_' + index;
  }

  addForm() {
    if (this.formArrayControls.length === this.maxForms) {
      return;
    }

    this.formArray.push(this._getNewFormGroup());
  }

  removeForm(index: number) {
    this.formArray.removeAt(index);
  }

  private _getNewFormGroup() {
    return new FormGroup<InfoForm>({
      country: new FormControl<string>('', [
        Validators.required,
        CountriesValidator(this.countries),
      ]),
      username: new FormControl<string>(
        '',
        [Validators.required],
        [UsernameValidator(this._formEditorService)],
      ),
      date: new FormControl<Date>(new Date(), [Validators.required]),
    });
  }
}
