import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { catchError, debounceTime, map, Observable, of } from 'rxjs';
import { FormEditorService } from '../../core/modules/form-editor/services/form-editor.service';

export function UsernameValidator(formEditorService: FormEditorService): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value) {
      return of(null);
    }

    return formEditorService.checkUser(control.value).pipe(
      debounceTime(300),
      map((response) => {
        return response.isAvailable ? null : { usernameError: true };
      }),
      catchError((error) => {
        console.error(error);

        throw error;
      }),
    );
  };
}
