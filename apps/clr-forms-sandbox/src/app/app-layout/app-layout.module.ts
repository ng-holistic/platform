import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ClrIconModule, ClrSignpostModule } from '@clr/angular';
import { HlcClrMainHeaderModule, HlcClrMainLayoutModule } from '@ng-holistic/clr-common';
import { HlcClrOptionsModule } from '@ng-holistic/clr-controls';
import { AppLayoutComponent } from './app-layout.component';

@NgModule({
    declarations: [AppLayoutComponent],
    imports: [
        RouterModule,
        HlcClrMainLayoutModule,
        HlcClrMainHeaderModule,
        ClrIconModule,
        ClrSignpostModule,
        HlcClrOptionsModule
    ],
    providers: [],
    bootstrap: []
})
export class AppLayoutModule {}
