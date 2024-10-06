import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

export const MATCHING_DATA = new InjectionToken<string[]>('MATCHING_DATA');
export const SEARCH_TERM = new InjectionToken<Observable<string>>('SEARCH_TERM');
