import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from "@angular/common";
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from "./app-routing.module";
import { environment } from "../environments/environment";
import { HttpClientModule } from "@angular/common/http";

let coreModule: any = BrowserModule;
if(environment.child)
  coreModule = CommonModule;

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    coreModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
