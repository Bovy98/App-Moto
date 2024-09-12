import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MotoComponent } from './componenti/moto/moto.component';
import { ImmatricolazioniComponent } from './componenti/immatricolazioni/immatricolazioni.component';

const routes: Routes = [
  { path: '', redirectTo: '/moto', pathMatch: 'full' },
  { path: 'moto', component: MotoComponent },
  { path: 'immatricolazioni', component: ImmatricolazioniComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
