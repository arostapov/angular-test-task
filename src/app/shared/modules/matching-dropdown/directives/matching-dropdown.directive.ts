import {
  ComponentRef,
  Directive,
  ElementRef,
  HostListener,
  inject,
  Input,
  OnDestroy,
  OnInit,
  ViewContainerRef,
} from '@angular/core';
import { NgControl } from '@angular/forms';
import {
  BehaviorSubject,
  debounceTime,
  distinctUntilChanged,
  filter,
  fromEvent,
  map,
  Observable,
  shareReplay,
  Subject,
  Subscription,
  switchMap,
  takeUntil,
  takeWhile,
  tap,
} from 'rxjs';

import { MatchingListWrapperComponent } from '../components';
import { CustomDropdownService } from '../../../services';
import { MATCHING_DATA, SEARCH_TERM } from '../constants';
import { Appearance } from '../../../interface';

@Directive({
  selector: 'input[matchingDropdown]',
  providers: [CustomDropdownService],
})
export class MatchingDropdownDirective implements OnInit, OnDestroy {
  private _ngControl: NgControl | null = inject(NgControl, { optional: true });
  private _viewContainerRef: ViewContainerRef = inject(ViewContainerRef);
  private _elementRef: ElementRef<HTMLInputElement> = inject(ElementRef);
  private _customDropdownService: CustomDropdownService<MatchingListWrapperComponent> =
    inject(CustomDropdownService);

  private _destroy$ = new Subject<void>();
  private _inputValue$ = new BehaviorSubject<string>('');
  private _showOn: Appearance = 'focus';

  private _triggerSub?: Subscription;
  private _blurSub?: Subscription;

  @Input()
  dataset: string[] = [];

  @Input()
  set showOn(value: Appearance) {
    this._showOn = value;

    this._addEventListenerByType();
  }

  get element(): HTMLInputElement {
    return this._elementRef.nativeElement;
  }

  get value$(): Observable<string> | undefined {
    return this._inputValue$?.pipe(debounceTime(500), distinctUntilChanged(), shareReplay(1));
  }

  @HostListener('input')
  onInput(): void {
    this._inputValue$.next(this.element.value);
  }

  ngOnInit() {
    this.initOverlay();
    this.initComponentPortal();
  }

  ngOnDestroy() {
    this._unsubscribeEvents();
  }

  initOverlay() {
    this._customDropdownService.createConnectedOverlayRef(this.element);
  }

  initComponentPortal() {
    const customInjector = this._customDropdownService.createInjector(
      [
        { provide: MATCHING_DATA, useValue: this.dataset },
        {
          provide: SEARCH_TERM,
          useValue: this.value$,
        },
      ],
      this._viewContainerRef.injector,
    );

    this._customDropdownService.createComponentPortal(
      MatchingListWrapperComponent,
      this._viewContainerRef,
      customInjector,
    );
  }

  triggerEventHandler() {
    this._triggerSub = fromEvent(this.element, this._showOn)
      .pipe(
        map(() => {
          const value = this.element.value;

          switch (this._showOn) {
            case 'input':
              this._toggleList(value);
              break;

            default:
              this._openList();
          }

          return this._customDropdownService.componentRef;
        }),
        distinctUntilChanged(),
        filter(Boolean),
        switchMap(
          (componentRef: ComponentRef<MatchingListWrapperComponent>) =>
            componentRef.instance.selectedItem$,
        ),
        takeUntil(this._destroy$),
      )
      .subscribe((value: string) => {
        if (!value) {
          return;
        }

        this._updateControlAndClose(value);
      });
  }

  blurEventHandler() {
    this._blurSub = fromEvent(this.element, 'blur')
      .pipe(
        switchMap(() => {
          return fromEvent(document, 'click').pipe(
            filter((event: Event) => {
              const target = event.target as HTMLElement;

              return !this._isMatchingListClicked(target) && !this._isInputClicked(target);
            }),
            tap(() => this._customDropdownService.hideOverlay()),
            takeWhile((event: Event) => {
              const target = event.target as HTMLElement;

              return this._isMatchingListClicked(target) || this._isInputClicked(target);
            }),
          );
        }),
        takeUntil(this._destroy$),
      )
      .subscribe();
  }

  private _openList() {
    this._customDropdownService.showOverlay();

    // because of changeDetectionStrategy onPush, I had to call changeDetection manually to see the list when overlay opens.
    this._customDropdownService.componentRef?.changeDetectorRef.markForCheck();
  }

  private _toggleList(value: string) {
    if (value && !this._customDropdownService.overlayRef?.hasAttached()) {
      this._openList();
    }

    if (!value) {
      this._customDropdownService.hideOverlay();
    }
  }

  private _addEventListenerByType() {
    this._unsubscribeEvents();

    this.triggerEventHandler();
    this.blurEventHandler();
  }

  private _updateControlAndClose(value: string) {
    this._customDropdownService.hideOverlay();

    this._ngControl?.control?.patchValue(value);

    this._inputValue$.next(value);
  }

  private _isMatchingListClicked(target: HTMLElement) {
    return this._customDropdownService.componentRef?.location.nativeElement.contains(target);
  }

  private _isInputClicked(target: HTMLElement) {
    return this.element.contains(target);
  }

  private _unsubscribeEvents() {
    this._triggerSub?.unsubscribe();
    this._blurSub?.unsubscribe();
  }
}
