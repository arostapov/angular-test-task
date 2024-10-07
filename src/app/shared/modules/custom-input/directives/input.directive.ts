import { Directive, HostBinding, Input } from '@angular/core';

import { InputSize } from '../../../interface';

@Directive({
  selector: 'input[customInput]',
  standalone: true,
  host: {
    class: 'custom-input',
  },
})
export class InputDirective {
  @HostBinding('class.disabled')
  disabled: boolean = false;

  @Input()
  @HostBinding('class')
  size: InputSize = 'medium';
}
