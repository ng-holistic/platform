import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing.module';
import { HlcClrMainLayoutModule } from '@ng-holistic/clr-common';

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        HlcClrMainLayoutModule.forRoot(),
        RouterModule.forRoot([], { initialNavigation: 'enabled' }),
        AppRoutingModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}
