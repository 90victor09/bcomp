import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from "@angular/common";
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { environment } from "../environments/environment";
import { BCompModule } from "../../../../src/app/bcomp.module";
import { InteractiveOpComponent } from './interactive-op/interactive-op.component';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

let coreModule: any = BrowserModule;
if(environment.child)
  coreModule = CommonModule;

@NgModule({
  declarations: [
    AppComponent,
    InteractiveOpComponent
  ],
  imports: [
    coreModule,
    CommonModule,
    AppRoutingModule,
    BCompModule
  ][!environment.child ? "append" : "reverse"](BrowserAnimationsModule), //A little hack
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
