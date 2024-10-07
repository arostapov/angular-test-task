import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { IsPrimitive } from './is-primitive';
import { IsDate } from './is-date';

// Just converting any type to form model, to protect our form from unexpected fields or fields with different datatype.
export type ConvertToFormModel<T> = {
  [K in keyof T]: IsDate<T[K]> extends true
    ? FormControl<T[K] | null>
    : IsPrimitive<T[K]> extends true
      ? FormControl<T[K] | null>
      : T[K] extends Array<infer ARR>
        ? IsPrimitive<ARR> extends true
          ? FormArray<FormControl<ARR | null>>
          : FormArray<FormGroup<ConvertToFormModel<ARR>>>
        : FormGroup<ConvertToFormModel<T[K]>>;
};
