import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BCompReg } from "./bcomp.reg";
import { BCompRunningCycle } from "./bcomp.running-cycle";
import { BCompMemoryView } from "./bcomp.memory-view";


@NgModule({
  declarations: [
    AppComponent,
    BCompReg,
    BCompRunningCycle,
    BCompMemoryView
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
