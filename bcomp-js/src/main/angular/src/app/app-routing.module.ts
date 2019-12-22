import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: "", loadChildren: () => import('../../projects/bcomp-app/src/app/app.module').then(mod => mod.AppModule) },
  { path: "console", loadChildren: () => import('../../projects/console/src/app/app.module').then(mod => mod.AppModule) },
  { path: 'program-tracing', loadChildren: () => import('../../projects/program-tracing/src/app/app.module').then(mod => mod.AppModule) },
  { path: 'microprogram-tracing', loadChildren: () => import('../../projects/microprogram-tracing/src/app/app.module').then(mod => mod.AppModule) },
  { path: 'microprogram-listing', loadChildren: () => import('../../projects/microprogram-listing/src/app/app.module').then(mod => mod.AppModule) },
  { path: '**', redirectTo: '/' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
