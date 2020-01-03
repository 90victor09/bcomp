import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from "@angular/common";
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { environment } from "../environments/environment";
import { BCompModule } from "../../../../src/app/bcomp.module";
import { InteractiveOpComponent } from './interactive-op/interactive-op.component';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

@NgModule({
  declarations: [
    AppComponent,
    InteractiveOpComponent
  ],
  imports: [
    (!environment.child ? BrowserModule : CommonModule),
    BrowserAnimationsModule,
    AppRoutingModule,
    BCompModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
