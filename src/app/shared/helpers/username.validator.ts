import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { catchError, debounceTime, map, Observable, of, switchMap, take } from 'rxjs';
import { FormEditorService } from '../../core/modules/form-editor/services';

export function UsernameAsyncValidator(formEditorService: FormEditorService): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value) {
      return of({ usernameError: true });
    }

    return of(control.value).pipe(
      debounceTime(300),
      switchMap((value) => formEditorService.checkUser(value).pipe(take(1))),
      map((response) => (response.isAvailable ? null : { usernameError: true })),
      catchError(() => of(null)),
      take(1),
    );
  };
}
