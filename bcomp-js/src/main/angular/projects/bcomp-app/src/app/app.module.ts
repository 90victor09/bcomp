import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { environment } from "../../../console/src/environments/environment";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BCompReg } from "./bcomp-reg/bcomp.reg";
import { BCompRunningCycle } from "./bcomp-running-cycle/bcomp.running-cycle";
import { BCompMemoryView } from "./bcomp-memory-view/bcomp.memory-view";
import { BCompALUComponent } from './bcomp-alu/bcomp-alu.component';
import { BCompCommutatorComponent } from './bcomp-commutator/bcomp-commutator.component';

import { BinaryPipe } from "./binary.pipe";
import { HexadecimalPipe } from "./hexadecimal.pipe";
import { GroupByPipe } from "./group-by.pipe";

@NgModule({
  declarations: [
    AppComponent,

    BCompReg,
    BCompALUComponent,
    BCompCommutatorComponent,
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
