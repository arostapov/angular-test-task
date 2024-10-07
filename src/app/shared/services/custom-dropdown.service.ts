import {
  ComponentRef,
  inject,
  Injectable,
  Injector,
  Provider,
  ViewContainerRef,
} from '@angular/core';
import { ComponentPortal, ComponentType, Portal } from '@angular/cdk/portal';
import { OverlayRef } from '@angular/cdk/overlay';
import { OverlayHelperService } from './overlay-helper.service';

@Injectable()
export class CustomDropdownService<CT = unknown> {
  private _overlayHelperService: OverlayHelperService = inject(OverlayHelperService);
  private _injector: Injector = inject(Injector);
  private _overlayRef?: OverlayRef;
  private _componentRef?: ComponentRef<CT>;
  private _portal?: Portal<unknown>;

  get overlayRef(): OverlayRef | undefined {
    return this._overlayRef;
  }

  get componentRef(): ComponentRef<CT> | undefined {
    return this._componentRef;
  }

  createInjector(providers: Provider[], parent?: Injector) {
    return Injector.create({
      parent: parent ?? this._injector,
      providers,
    });
  }

  createComponentPortal<T extends CT>(
    component: ComponentType<T>,
    viewRef: ViewContainerRef,
    injector?: Injector,
  ): ComponentPortal<T> {
    const defaultInjector = injector ?? this.createInjector([]);

    const portal = new ComponentPortal<T>(component, viewRef, defaultInjector);

    // The reason why I used here basic portal type is possibility to assign TemplatePortal also.
    this._portal = portal;

    return portal;
  }

  // Here we also could have method for TemplatePortal

  createConnectedOverlayRef(connectedTo: HTMLElement): OverlayRef {
    const config = this._overlayHelperService.getConnectedOverlayConfig(connectedTo);

    this._overlayRef = this._overlayHelperService.createOverlay(config);

    return this._overlayRef;
  }

  showOverlay() {
    if (!this._overlayRef) {
      return;
    }

    // it was written this way, to be able to attach another portal type to overlay if needed
    if (this._portal instanceof ComponentPortal) {
      this._componentRef = this._overlayRef.attach(this._portal);
    }
  }

  hideOverlay() {
    if (!this._overlayRef || !this._overlayRef?.hasAttached()) {
      return;
    }

    this._overlayRef.detach();
  }
}
