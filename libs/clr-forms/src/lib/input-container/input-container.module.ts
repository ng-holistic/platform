import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ClrIconModule } from '@clr/angular';
import { HlcClrInputContainerComponent } from './input-container.component';
import { InputErrorComponent } from './input-error/input-error.component';
import {
    ValidationErrorsMapConfig,
    VALIDATION_ERRORS_MAP_CONFIG
} from './validation-errors/validation-errors-map-config';
import { ValidationErrorsComponent } from './validation-errors/validation-errors.component';

@NgModule({
    imports: [CommonModule, ReactiveFormsModule, ClrIconModule],
    declarations: [HlcClrInputContainerComponent, InputErrorComponent, ValidationErrorsComponent],
    exports: [HlcClrInputContainerComponent, InputErrorComponent],
    entryComponents: [HlcClrInputContainerComponent]
})
export class HlcClrInputContainerModule {
    static forRoot({ validationErrorsMap }: { validationErrorsMap: ValidationErrorsMapConfig }): ModuleWithProviders {
        return {
            ngModule: HlcClrInputContainerModule,
            providers: [
                {
                    provide: VALIDATION_ERRORS_MAP_CONFIG,
                    useValue: validationErrorsMap
                }
            ]
        };
    }
}
