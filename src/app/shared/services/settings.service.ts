import { computed, Injectable, Signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, filter, Observable, take, tap } from 'rxjs';

import { MinifiedSettings, Settings } from '../interface/settings';
import { PostSettingsData } from '../interface';

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private _settingsSubject: BehaviorSubject<Settings | undefined> = new BehaviorSubject<
    Settings | undefined
  >(undefined);
  settings: Signal<Settings | undefined> = toSignal<Settings>(this.settings$);
  settingsMini: Signal<MinifiedSettings> = computed(() => {
    const mini: MinifiedSettings = {} as MinifiedSettings;

    const settings = this.settings();

    if (!settings) {
      return mini;
    }

    for (const key in settings) {
      mini[key] = settings[key].value;
    }

    return mini;
  });

  get settings$(): Observable<Settings> {
    return this._settingsSubject.asObservable().pipe(filter(Boolean));
  }

  constructor(private _http: HttpClient) {
    this.get()
      .pipe(take(1))
      .subscribe((settings) => {
        this._settingsSubject.next(settings);
      });
  }

  save(settings: MinifiedSettings): Observable<PostSettingsData> {
    return this._http.post<PostSettingsData>('/api/settings', settings).pipe(
      tap((response) => {
        if (!response.success) {
          return;
        }

        this._settingsSubject.next(response.updatedSettings);
      }),
    );
  }

  get(): Observable<Settings> {
    return this._http.get<Settings>('/api/settings');
  }
}
