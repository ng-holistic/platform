import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { Router } from '@angular/router';
import { ClrMainContainerModule } from '@clr/angular';
import { HlcSideNavConfig, HLC_SIDE_NAV_CONFIG, routerSideNavConfigProvider } from '../side-nav/side-nav.component';
import { HlcClrSideNavModule } from '../side-nav/side-nav.module';
import { HlcClrMainLayoutComponent } from './main-layout.component';

export const sideNavConfigFactory = (sideNavConfig: HlcSideNavConfig | true) => (router: Router) => {
    if (sideNavConfig === true) {
        return routerSideNavConfigProvider(router);
    } else {
        return sideNavConfig;
    }
};

@NgModule({
    imports: [CommonModule, ClrMainContainerModule, HlcClrSideNavModule],
    declarations: [HlcClrMainLayoutComponent],
    exports: [HlcClrMainLayoutComponent]
})
export class HlcClrMainLayoutModule {
    constructor() {}

    /**
     * True for use routerSideNavConfigProvider (RouterModule must be imported in app!)
     * It will route app to path when side nav item clicked
     */
    static forRoot(sideNavConfig: HlcSideNavConfig | true = true): ModuleWithProviders {
        return {
            ngModule: HlcClrMainLayoutModule,
            providers: [
                {
                    provide: HLC_SIDE_NAV_CONFIG,
                    useFactory: sideNavConfigFactory(sideNavConfig),
                    deps: [Router]
                }
            ]
        };
    }
}
