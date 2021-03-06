import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppsSharedModule } from '@apps/shared';
import { HlcClrModalModule } from '@ng-holistic/clr-common';
import { HlcClrFormModule } from '@ng-holistic/clr-forms';
import { FormInModalComponent, FormInModalPageComponent } from './form-in-modal-page.component';

///
@NgModule({
    declarations: [FormInModalPageComponent, FormInModalComponent],
    imports: [CommonModule, HlcClrModalModule, HlcClrFormModule, AppsSharedModule],
    exports: [FormInModalPageComponent],
    entryComponents: [FormInModalComponent]
})
export class FormInModalPageModule {}
