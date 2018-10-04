import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormLayoutModule, GroupsLayoutMap, HLC_GROUPS_LAYOUT } from '../form-layout';
import { FormComponent } from './form.component';

@NgModule({
    declarations: [FormComponent, FormLayoutModule],
    imports: [CommonModule],
    providers: [],
    exports: [FormComponent]
})
export class FormModule {
    static forRoot(groupsLayoutMap: GroupsLayoutMap): ModuleWithProviders {
        return {
            ngModule: FormLayoutModule,
            providers: [
                {
                    provide: HLC_GROUPS_LAYOUT,
                    multi: true,
                    useValue: groupsLayoutMap
                }
            ]
        };
    }
}
