import {
  ComponentRef,
  inject,
  Injectable,
  Injector,
  Provider,
  ViewContainerRef,
} from '@angular/core';
import { ComponentPortal, ComponentType, Portal, TemplatePortal } from '@angular/cdk/portal';
import { OverlayRef } from '@angular/cdk/overlay';
import { OverlayHelperService } from './overlay-helper.service';

@Injectable({ providedIn: 'root' })
export class CustomDropdownService<CT = unknown> {
  private _overlayHelperService: OverlayHelperService = inject(OverlayHelperService);
  private _injector: Injector = inject(Injector);
  private _overlayRef?: OverlayRef;
  private _componentRef?: ComponentRef<CT>;
  private _portal?: Portal<unknown>;

  get overlayRef(): OverlayRef | undefined {
    return this._overlayRef;
  }

  get componentPortal(): ComponentPortal<CT> | undefined {
    return this._portal instanceof ComponentPortal
      ? (this._portal as ComponentPortal<CT>)
      : undefined;
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

    if (this._portal instanceof ComponentPortal) {
      this._componentRef = this._overlayRef.attach(this._portal);
    }

    if (this._portal instanceof TemplatePortal) {
      // this._embeddedViewRef = this._overlayRef.attach(this._portal);
    }
  }

  hideOverlay() {
    if (!this._overlayRef || !this._overlayRef?.hasAttached()) {
      return;
    }

    this._overlayRef.detach();
  }

  removeOverlay() {
    this._overlayRef?.dispose();
  }
}
