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

import { BCompModule } from "../../../../src/app/bcomp.module";

let coreModule: any = BrowserModule;
if(environment.child)
  coreModule = CommonModule;

@NgModule({
  declarations: [
    AppComponent,

    BCompReg,
    BCompALUComponent,
    BCompCommutatorComponent,
    BCompRunningCycle,
    BCompMemoryView
  ],
  imports: [
    coreModule,
    BCompModule,
    AppRoutingModule
  ],
  providers: [],
  exports: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
