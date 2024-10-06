import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-core-wrapper',
  templateUrl: './core-wrapper.component.html',
  styleUrl: './core-wrapper.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoreWrapperComponent {}
