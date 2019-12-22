import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BCompReg } from "./bcomp-reg/bcomp.reg";
import { BCompRunningCycle } from "./bcomp-running-cycle/bcomp.running-cycle";
import { BCompMemoryView } from "./bcomp-memory-view/bcomp.memory-view";
import { BinaryPipe } from "./binary.pipe";
import { HexadecimalPipe } from "./hexadecimal.pipe";
import { GroupByPipe } from "./group-by.pipe";
import { environment } from "../../../console/src/environments/environment";
import { CommonModule } from "@angular/common";

@NgModule({
  declarations: [
    AppComponent,

    BCompReg,
    BCompRunningCycle,
    BCompMemoryView,

    BinaryPipe,
    HexadecimalPipe,
    GroupByPipe
  ],
  imports: [
    (!environment.child ? BrowserModule : CommonModule),
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
