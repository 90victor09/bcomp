import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BCompReg } from "./bcomp-reg/bcomp.reg";
import { BCompRunningCycle } from "./bcomp-running-cycle/bcomp.running-cycle";
import { BCompMemoryView } from "./bcomp-memory-view/bcomp.memory-view";

import { BCompService } from "./bcomp.service";
import { BinaryPipe } from './binary.pipe';
import { HexadecimalPipe } from './hexadecimal.pipe';
import { GroupByPipe } from './group-by.pipe';


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
    BrowserModule
  ],
  providers: [BCompService],
  bootstrap: [AppComponent]
})
export class AppModule { }
