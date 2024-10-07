import { Injectable } from '@angular/core';
import { map, Observable, Subject, switchMap, take, timer } from 'rxjs';

@Injectable()
export class FormSubmissionUtilsService {
  private _delayedEventSubject: Subject<number> = new Subject();

  get delayedEvent$(): Observable<number> {
    return this._delayedEventSubject
      .asObservable()
      .pipe(switchMap((seconds: number) => timer(this._getMs(seconds))));
  }

  emitWithDelay(sec: number) {
    this._delayedEventSubject.next(sec);
  }

  getTimerWatch(sec: number) {
    return timer(0, 1000).pipe(
      map((seconds: number) => this.formatTime(sec - seconds)),
      take(sec + 1),
    );
  }

  private formatTime(seconds: number): string {
    const minutes: number = Math.floor(seconds / 60);
    const remainingSeconds: number = seconds % 60;

    return `${this.pad(minutes)}:${this.pad(remainingSeconds)}`;
  }

  private pad(num: number): string {
    return num < 10 ? '0' + num : String(num);
  }

  private _getMs(s: number): number {
    return s * 1000;
  }
}
