import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  CheckUserResponseData,
  InfoModel,
  SubmitFormResponseData,
} from '../../../../shared/interface';

@Injectable({ providedIn: 'root' })
export class FormEditorService {
  private _http: HttpClient = inject(HttpClient);

  checkUser(username: string): Observable<CheckUserResponseData> {
    return this._http.post<CheckUserResponseData>('/api/checkUsername', { username });
  }

  submitAllForms(formValue: InfoModel[]): Observable<SubmitFormResponseData> {
    return this._http.post<SubmitFormResponseData>('/api/submitForm', { formValue });
  }
}
