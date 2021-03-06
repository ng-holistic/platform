import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
    HlcClrDateComponent,
    HlcClrDateModule,
    HlcClrTextAreaComponent,
    HlcClrTextAreaModule,
    HlcClrTextComponent,
    HlcClrTextModule
} from '@ng-holistic/clr-controls';
import { NgSelectPageComponent } from './ng-select-page/ng-select-page.component';
import { NgSelectPageModule } from './ng-select-page/ng-select-page.module';
import { PairsListPageComponent } from './pairs-list/pairs-list-page.component';
import { PairsListPageModule } from './pairs-list/pairs-list-page.module';
import { SelectPageComponent } from './select-page/select-page.component';
import { SelectPageModule } from './select-page/select-page.module';
import { TypeaheadPageComponent } from './tyepahead-page/typeahead-page.component';
import { TypeaheadPageModule } from './tyepahead-page/typeahead-page.module';

export const routes: Routes = [
    {
        path: 'text',
        component: HlcClrTextComponent
    },
    {
        path: 'text-area',
        component: HlcClrTextAreaComponent
    },
    {
        path: 'date',
        component: HlcClrDateComponent
    },
    {
        path: 'select',
        component: SelectPageComponent
    },
    {
        path: 'pairs-list',
        component: PairsListPageComponent
    },
    {
        path: 'typeahead',
        component: TypeaheadPageComponent
    },
    {
        path: 'tags',
        component: TypeaheadPageComponent
    },
    {
        path: 'ng-select',
        component: NgSelectPageComponent
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        HlcClrTextModule,
        HlcClrTextAreaModule,
        HlcClrDateModule,
        PairsListPageModule,
        SelectPageModule,
        TypeaheadPageModule,
        NgSelectPageModule
    ],
    exports: [RouterModule],
    entryComponents: []
})
export class ClrControlsRoutingModule {}
