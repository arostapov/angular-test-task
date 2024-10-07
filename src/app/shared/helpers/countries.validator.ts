import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const CountriesValidator = (dataset: string[]): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    const isValid = dataset.includes(control?.value?.trim());

    if (isValid) {
      return null;
    }

    return {
      countryError: true,
    };
  };
};
