import { Settings } from './settings';

export interface CheckUserResponseData {
  isAvailable: boolean;
}

export interface SubmitFormResponseData {
  result: string;
}

export interface PostSettingsData {
  success: boolean;
  updatedSettings: Settings;
}
