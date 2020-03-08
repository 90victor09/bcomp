import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AppComponent } from "./app.component";
import { environment } from "../environments/environment";

const routes: Routes = [
  { path: "", component: AppComponent}
];

@NgModule({
  imports: [
    RouterModule[!environment.child ? 'forRoot' : 'forChild'](routes)
  ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
