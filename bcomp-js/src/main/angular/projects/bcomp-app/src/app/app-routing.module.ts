import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { environment } from "../../../console/src/environments/environment";
import { AppComponent } from "./app.component";

const routes: Routes = [
  { path: '', component: AppComponent }
];

@NgModule({
  imports: [
    RouterModule[!environment.child ? 'forRoot' : 'forChild'](routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
