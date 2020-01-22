import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from "@angular/common";
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { environment } from "../environments/environment";

let coreModule: any = BrowserModule;
if(environment.child)
  coreModule = CommonModule;

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    coreModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
