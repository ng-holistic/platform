import { ModuleWithProviders, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ClrIconModule, ClrNavigationModule, ClrVerticalNavModule } from '@clr/angular';
import { HlcHotKeysModule } from '../hotkeys/hotkeys.module';
import { HlcClrSideNavComponent, HlcSideNavConfig, HLC_SIDE_NAV_CONFIG } from './side-nav.component';

@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        ClrIconModule,
        ClrVerticalNavModule,
        ClrNavigationModule,
        HlcHotKeysModule
    ],
    declarations: [HlcClrSideNavComponent],
    exports: [HlcClrSideNavComponent]
})
export class HlcClrSideNavModule {
    constructor() {}

    static forRoot(config: HlcSideNavConfig): ModuleWithProviders {
        return {
            ngModule: HlcClrSideNavModule,
            providers: [
                {
                    provide: HLC_SIDE_NAV_CONFIG,
                    useValue: config
                }
            ]
        };
    }
}
