import { Pipe, PipeTransform } from '@angular/core';
import { FormArray } from '@angular/forms';

@Pipe({
  name: 'invalidFormsCount',
  standalone: true,
  pure: false,
})
export class InvalidFormsPipe implements PipeTransform {
  transform(arr: FormArray): number {
    const controls = arr.controls;

    return controls.filter((control) => control.invalid).length;
  }
}
