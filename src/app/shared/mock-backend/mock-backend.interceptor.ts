import { HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delay, Observable, of, tap } from 'rxjs';
import { CheckUserResponseData, PostSettingsData, SubmitFormResponseData } from '../interface';
import { MinifiedSettings, Settings } from '../interface/settings';
import { defaultSettings } from '../mock-data/defaultSettings';

@Injectable()
export class MockBackendInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<
    HttpResponse<CheckUserResponseData | SubmitFormResponseData | PostSettingsData | Settings>
  > {
    if (req.url.endsWith('/api/checkUsername') && req.method === 'POST') {
      return this.handleCheckUsername(req);
    }

    if (req.url.endsWith('/api/submitForm') && req.method === 'POST') {
      return this.handleSubmitForm();
    }

    if (req.url.endsWith('/api/settings') && req.method === 'GET') {
      return this.handleGetSettings();
    }

    if (req.url.endsWith('/api/settings') && req.method === 'POST') {
      return this.handlePostSettings(req.body);
    }

    return of(
      new HttpResponse({ status: 404, body: { result: 'You are using the wrong endpoint' } }),
    );
  }

  private handleCheckUsername(
    req: HttpRequest<any>,
  ): Observable<HttpResponse<CheckUserResponseData>> {
    const isAvailable = req.body.username.includes('new');
    const response = new HttpResponse({ status: 200, body: { isAvailable } });

    return of(response).pipe(
      delay(500),
      tap(() => console.log('checkUsername response:', { isAvailable })),
    );
  }

  private handleSubmitForm(): Observable<HttpResponse<SubmitFormResponseData>> {
    const response = new HttpResponse({ status: 200, body: { result: 'nice job' } });

    return of(response).pipe(
      delay(500),
      tap(() => console.log('submitForm response')),
    );
  }

  private handleGetSettings(): Observable<HttpResponse<Settings>> {
    const response = new HttpResponse({
      status: 200,
      body: this._getSettings() ?? defaultSettings,
    });

    return of(response).pipe(
      delay(500),
      tap(() => console.log('get settings response')),
    );
  }

  private handlePostSettings(body: MinifiedSettings): Observable<HttpResponse<PostSettingsData>> {
    const settings: Settings = this._getSettings() ?? defaultSettings;

    const updatedSettings: Settings = this._updateSettings(settings, body);

    const response = new HttpResponse({ status: 200, body: { success: true, updatedSettings } });

    this._saveSettings(updatedSettings);

    return of(response).pipe(
      delay(500),
      tap(() => console.log('post settings response')),
    );
  }

  private _getSettings(): Settings | null {
    const settingsStr = localStorage.getItem('settings');

    try {
      return settingsStr ? JSON.parse(settingsStr) : null;
    } catch (e) {
      return null;
    }
  }

  private _saveSettings(settings: Settings) {
    if (!settings) {
      return;
    }

    localStorage.setItem('settings', JSON.stringify(settings));
  }

  private _updateSettings(settings: Settings, updatedSettings: MinifiedSettings): Settings {
    const clone = structuredClone(settings);

    for (const key in clone) {
      clone[key] = {
        ...clone[key],
        value: updatedSettings[key],
      };
    }

    return clone;
  }
}
