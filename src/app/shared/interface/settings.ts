import { Appearance } from './appearance';
import { ConvertToFormModel } from './convert-to-form-model';

export interface Settings {
  maxFormsCount: Setting<number>;
  dropdownAppearance: Setting<Appearance>;
  formCancellableSeconds: Setting<number>;
  [propName: string]: Setting;
}

export interface Setting<T = unknown> {
  id: string;
  title: string;
  value: T;
  controlType: SettingControlType;
  options?: string[];
}

export type SettingControlType = 'input' | 'select';

export type MinifiedSettings<T extends Settings = Settings> = {
  [K in keyof T]: T[K]['value'];
};

export type SettingsForm = ConvertToFormModel<Partial<MinifiedSettings>>;
