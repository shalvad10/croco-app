import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { WheelComponent } from './wheel/wheel.component';
import { PrizesListComponent } from './prizes-list/prizes-list.component';

@NgModule({
  declarations: [
    AppComponent,
    WheelComponent,
    PrizesListComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
