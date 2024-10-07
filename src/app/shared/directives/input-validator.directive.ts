import {
  ChangeDetectorRef,
  Directive,
  ElementRef,
  HostListener,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
} from '@angular/core';
import { NgControl } from '@angular/forms';
import { Subscription } from 'rxjs';

@Directive({ selector: 'input[inputValidator]', standalone: true })
export class InputValidatorDirective implements OnInit, OnDestroy {
  private _cd: ChangeDetectorRef = inject(ChangeDetectorRef);
  private _ngControl: NgControl | null = inject(NgControl, {
    optional: true,
    self: true,
  });
  private _renderer: Renderer2 = inject(Renderer2);
  private _elementRef: ElementRef = inject(ElementRef);

  private _sub?: Subscription;

  private span: HTMLElement | null = null;

  @Input()
  errorMessage: string = 'Invalid value';

  get element(): HTMLInputElement {
    return this._elementRef.nativeElement;
  }

  @HostListener('blur')
  onBlur(): void {
    if (this._ngControl?.status === 'PENDING' || this._ngControl?.status === 'DISABLED') {
      return;
    }

    this._toggleErrorMessageElement(this.controlInvalid);
  }

  get controlInvalid(): boolean {
    return (
      (this._ngControl?.control?.invalid &&
        (this._ngControl?.control?.touched || this._ngControl?.control?.dirty)) ||
      false
    );
  }

  ngOnInit() {
    this._controlValueChangesHandler();
  }

  ngOnDestroy() {
    this._sub?.unsubscribe();
  }

  private _controlValueChangesHandler() {
    if (!this._ngControl?.control?.statusChanges) {
      return;
    }

    this._sub = this._ngControl.control.statusChanges.subscribe((status) => {
      // To update input classes from ng-pending to ng-invalid/ng-valid and some other props like disabled.
      this._cd.markForCheck();

      if (status === 'PENDING' || status === 'DISABLED') {
        return;
      }

      this._toggleErrorMessageElement(this.controlInvalid);
    });
  }

  private _toggleErrorMessageElement(isInvalid?: boolean | null) {
    if (!this.span && isInvalid) {
      this._addElement();
    }

    if (this.span && !isInvalid) {
      this._removeElement();
    }
  }

  private _addElement() {
    this.span = this._getSpanElement(this.errorMessage);

    this._renderer.insertBefore(this.element.parentNode, this.span, this.element.nextSibling);
  }

  private _removeElement() {
    this._renderer.removeChild(this.element.parentNode, this.span);

    this.span = null;
  }

  private _getSpanElement(content?: string): HTMLSpanElement {
    const element = this._renderer.createElement('span') as HTMLSpanElement;

    this._renderer.addClass(element, 'validator-error-message');
    this._renderer.addClass(element, 'absolute');
    this._renderer.setStyle(
      element,
      'top',
      this.element.offsetTop + this.element.offsetHeight + 'px',
    );

    if (content) {
      this._renderer.setProperty(element, 'textContent', content);
    }

    return element;
  }
}
