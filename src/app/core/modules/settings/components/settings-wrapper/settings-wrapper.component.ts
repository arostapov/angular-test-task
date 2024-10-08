import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnDestroy,
  OnInit,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { SettingsService } from '../../../../../shared/services';
import { MinifiedSettings, Settings, SettingsForm } from '../../../../../shared/interface/settings';

@Component({
  selector: 'app-settings-wrapper',
  templateUrl: './settings-wrapper.component.html',
  styleUrl: './settings-wrapper.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsWrapperComponent implements OnInit, OnDestroy {
  private _settingsService: SettingsService = inject(SettingsService);
  private _settingsSub?: Subscription;

  form: FormGroup<SettingsForm> = new FormGroup<SettingsForm>({});
  settings$: Observable<Settings> = this._settingsService.settings$;
  settingsKeys: Signal<string[]> = computed(() => {
    const settings = this._settingsService.settings();

    return settings ? Object.keys(settings) : [];
  });
  submitting: WritableSignal<boolean> = signal(false);

  ngOnInit() {
    this._settingsHandler();
  }

  ngOnDestroy() {
    this._settingsSub?.unsubscribe();
  }

  saveSettings() {
    if (this.form.invalid) {
      return;
    }

    this.submitting.set(true);

    this._settingsService
      .save(this.form.value as MinifiedSettings)
      .subscribe(() => this.submitting.set(false));
  }

  private _settingsHandler() {
    this._settingsSub = this.settings$.subscribe((settings: Settings) => {
      for (const key in settings) {
        const setting = settings[key];

        this._addControlToForm(key, setting.value);
      }
    });
  }

  private _addControlToForm(key: string, value: unknown) {
    const control = new FormControl<unknown>(value, [Validators.required]);

    this.form.addControl(key, control);
  }
}
