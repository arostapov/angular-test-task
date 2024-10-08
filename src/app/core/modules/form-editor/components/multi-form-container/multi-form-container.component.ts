import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  OnInit,
  Signal,
} from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { catchError, Observable, Subscription, switchMap, take } from 'rxjs';

import { InfoForm, InfoModel } from '../../../../../shared/interface';
import { CountriesValidator, UsernameAsyncValidator } from '../../../../../shared/helpers';
import { Country } from '../../../../../shared/enum/country';
import { FormSubmissionUtilsService, SettingsService } from '../../../../../shared/services';
import { FormEditorService } from '../../services';
import { MinifiedSettings } from '../../../../../shared/interface/settings';

@Component({
  selector: 'app-multi-form',
  templateUrl: './multi-form-container.component.html',
  styleUrl: './multi-form-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [FormSubmissionUtilsService],
})
export class MultiFormContainerComponent implements OnInit, OnDestroy {
  private _cd: ChangeDetectorRef = inject(ChangeDetectorRef);
  private _formEditorService: FormEditorService = inject(FormEditorService);
  private _settingsService: SettingsService = inject(SettingsService);
  private _formSubmissionUtilsService: FormSubmissionUtilsService = inject(
    FormSubmissionUtilsService,
  );
  private _submitSubscription?: Subscription;
  settings: Signal<MinifiedSettings> = this._settingsService.settingsMini;

  isFormSubmissionStarted: boolean = false;
  countries = Object.keys(Country);
  timer$: Observable<string> = this._formSubmissionUtilsService.getTimerWatch(
    this.settings().formCancellableSeconds,
  );
  formArray: FormArray<FormGroup<InfoForm>> = new FormArray([this._getNewFormGroup()]);

  get submitDisabled(): boolean {
    return (
      this.formArray.status === 'PENDING' ||
      this.formArray.invalid ||
      !this.formArrayControls.length ||
      this.isFormSubmissionStarted
    );
  }

  get formArrayControls(): FormGroup<InfoForm>[] {
    return this.formArray.controls;
  }

  ngOnInit() {
    this._submissionEventHandler();
  }

  ngOnDestroy() {
    this._submitSubscription?.unsubscribe();
  }

  formTrackBy(index: number, _: FormGroup<InfoForm>) {
    return 'form_' + index;
  }

  addForm() {
    if (
      this.formArrayControls.length === this.settings().maxFormsCount ||
      this.isFormSubmissionStarted
    ) {
      return;
    }

    this.formArray.push(this._getNewFormGroup());
  }

  removeForm(index: number) {
    if (this.isFormSubmissionStarted) {
      return;
    }

    this.formArray.removeAt(index);
  }

  private _getNewFormGroup() {
    return new FormGroup<InfoForm>({
      country: new FormControl<string>('', [
        Validators.required,
        CountriesValidator(this.countries),
      ]),
      username: new FormControl<string>('', {
        validators: [Validators.required],
        asyncValidators: [UsernameAsyncValidator(this._formEditorService)],
      }),
      date: new FormControl<Date | null>(null, [Validators.required]),
    });
  }

  private _submissionEventHandler() {
    this._submitSubscription = this._formSubmissionUtilsService.delayedEvent$
      .pipe(
        switchMap(() =>
          this._formEditorService
            .submitAllForms(this.formArray.getRawValue() as InfoModel[])
            .pipe(take(1)),
        ),
        catchError((err) => {
          this.isFormSubmissionStarted = false;

          throw err;
        }),
      )
      .subscribe(() => {
        this.isFormSubmissionStarted = false;

        this.formArray.enable();
        this.formArray.reset([]);

        // to update template when api responds
        this._cd.markForCheck();
      });
  }

  startSubmission() {
    if (this.formArray.invalid) {
      return;
    }

    this.formArray.disable();

    this.isFormSubmissionStarted = true;

    this._formSubmissionUtilsService.emitWithDelay(this.settings().formCancellableSeconds);
  }

  cancelSubmission() {
    if (!this.isFormSubmissionStarted || !this._submitSubscription) {
      return;
    }

    this.formArray.enable();

    this.isFormSubmissionStarted = false;

    this._submitSubscription?.unsubscribe();

    this._submissionEventHandler();
  }
}
