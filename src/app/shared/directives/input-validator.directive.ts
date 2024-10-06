import { Directive, ElementRef, inject, Input, OnInit, Renderer2 } from '@angular/core';
import { NgControl, ValidationErrors } from '@angular/forms';

@Directive({ selector: '[inputValidator]', standalone: true })
export class InputValidatorDirective implements OnInit {
  private _ngControl: NgControl | null = inject(NgControl, { optional: true });
  private _renderer: Renderer2 = inject(Renderer2);
  private _elementRef: ElementRef = inject(ElementRef);

  private span: HTMLElement | null = null;

  @Input()
  errorMessage: string = 'Invalid value';

  get element(): HTMLInputElement {
    return this._elementRef.nativeElement;
  }

  ngOnInit() {
    this._controlValueChangesHandler();
  }

  private _controlValueChangesHandler() {
    if (!this._ngControl?.valueChanges) {
      return;
    }

    this._ngControl.valueChanges.subscribe(() =>
      this._toggleErrorMessageElement(this._ngControl?.errors),
    );
  }

  private _toggleErrorMessageElement(errors?: ValidationErrors | null) {
    if (!this.span && errors && Object.keys(errors).length > 0) {
      this._addElement();
    }

    if (this.span && !errors) {
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
