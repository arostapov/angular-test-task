import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-multi-form',
  templateUrl: './multi-form-container.component.html',
  styleUrl: './multi-form-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultiFormContainerComponent {}
