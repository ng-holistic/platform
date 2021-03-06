import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FirstFormComponent } from './first-form/first-form.component';
import { FirstFormModule } from './first-form/first-form.module';
import { FormFieldPropsComponent } from './form-field-props/form-field-props.component';
import { FormFieldPropsModule } from './form-field-props/form-field-props.module';
import { FormFieldWrapperComponent } from './form-field-wrapper/form-field-wrapper.component';
import { FormFieldWrapperModule } from './form-field-wrapper/form-field-wrapper.module';
import { FormValuesPageComponent } from './form-values-page/form-values-page.component';
import { FormValuesPageModule } from './form-values-page/form-values-page.module';
import { InstallPackagesComponent } from './install-packages/install-packages.component';
import { InstallPackagesModule } from './install-packages/install-packages.module';
import { OverviewComponent } from './overview/overview.component';
import { OverviewModule } from './overview/overview.module';

export const routes: Routes = [
    {
        path: 'overview',
        component: OverviewComponent
    },
    {
        path: 'install-packages',
        component: InstallPackagesComponent
    },
    {
        path: 'first-form',
        component: FirstFormComponent
    },
    {
        path: 'form-values',
        component: FormValuesPageComponent
    },
    {
        path: 'form-field-props',
        component: FormFieldPropsComponent
    },
    {
        path: 'form-field-wrapper',
        component: FormFieldWrapperComponent
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        OverviewModule,
        InstallPackagesModule,
        FirstFormModule,
        FormValuesPageModule,
        FormFieldPropsModule,
        FormFieldWrapperModule
    ],
    exports: [RouterModule],
    entryComponents: []
})
export class GettingStartedRoutingModule {}
