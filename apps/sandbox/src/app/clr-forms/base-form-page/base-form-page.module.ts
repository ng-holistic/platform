import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ClrFormsModule, FormFooterModule } from '@ng-holistic/clr-forms';
import { BaseFormPageComponent } from './base-form-page.component';

@NgModule({
    declarations: [BaseFormPageComponent],
    imports: [CommonModule, ClrFormsModule, FormFooterModule],
    exports: [BaseFormPageComponent]
})
export class BaseFormPageModule {}