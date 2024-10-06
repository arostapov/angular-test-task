import { inject, Injectable } from '@angular/core';
import {
  ConnectedPosition,
  Overlay,
  OverlayConfig,
  OverlayRef,
  PositionStrategy,
  ScrollStrategy,
} from '@angular/cdk/overlay';
import { DEFAULT_POSITION } from '../constants';

@Injectable({ providedIn: 'root' })
export class OverlayHelperService {
  private _overlay: Overlay = inject(Overlay);

  getConnectedOverlayConfig(
    hostElement: HTMLElement,
    customPositions?: ConnectedPosition[],
  ): OverlayConfig {
    const positions: ConnectedPosition[] = customPositions ?? DEFAULT_POSITION;

    const positionStrategy = this._overlay
      .position()
      .flexibleConnectedTo(hostElement)
      .withGrowAfterOpen()
      .withPush(false)
      .withPositions(positions);

    const config: OverlayConfig = this.getBaseOverlayConfig(positionStrategy);

    config.width = hostElement.offsetWidth + 'px';
    config.minHeight = hostElement.offsetHeight + 'px';

    return config;
  }

  getBaseOverlayConfig(
    positionStrategy: PositionStrategy,
    scrollStrategy?: ScrollStrategy,
  ): OverlayConfig {
    return new OverlayConfig({
      positionStrategy,
      scrollStrategy: scrollStrategy ?? this._overlay.scrollStrategies.reposition(),
      hasBackdrop: false,
      backdropClass: 'custom-overlay-backdrop',
    });
  }

  createOverlay(config: OverlayConfig): OverlayRef {
    return this._overlay.create(config);
  }
}
