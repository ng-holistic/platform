import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppLayoutComponent } from './app-layout/app-layout.component';
import { AppLayoutModule } from './app-layout/app-layout.module';
import { ClrFilterModule } from './clr-filter/clr-filter.module';
import { routes as clrFilterRoutes } from './clr-filter/clr-filter.routing.module';
import { ClrListModule } from './clr-list/clr-list.module';
import { routes as clrListRoutes } from './clr-list/clr-list.routing.module';
import { ClrTableModule } from './clr-table/clr-table.module';
import { routes as clrTableRoutes } from './clr-table/clr-table.routing.module';
import { DocumentationModule } from './documentation/documentation.module';
import { routes as docsRoutes } from './documentation/documentation.routing.module';
import { FaqPageComponent } from './faq/faq-page/faq-page.component';
import { FaqPageModule } from './faq/faq-page/faq-page.module';
import { HomePageComponent } from './home-page/home-page.component';
import { DduxPageComponent } from './ddux-page/ddux-page.component';
import { DduxPageModule } from './ddux-page/ddux-page.module';
import { HomePageModule } from './home-page/home-page.module';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
    },
    {
        path: '',
        component: AppLayoutComponent,
        children: [
            {
                path: 'home',
                component: HomePageComponent
            },
            {
                path: 'ddux',
                component: DduxPageComponent
            },
            {
                path: 'faq',
                component: FaqPageComponent
            },
            {
                path: 'docs',
                children: docsRoutes
            },
            {
                path: 'clr-filter',
                children: clrFilterRoutes
            },
            {
                path: 'clr-table',
                children: clrTableRoutes
            },
            {
                path: 'clr-list',
                children: clrListRoutes
            }
        ]
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        AppLayoutModule,
        ClrTableModule,
        ClrFilterModule,
        ClrListModule,
        DocumentationModule,
        FaqPageModule,
        DduxPageModule,
        HomePageModule
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {}
