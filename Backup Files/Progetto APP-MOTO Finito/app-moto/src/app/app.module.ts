import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { MotoComponent } from './componenti/moto/moto.component';
import { ImmatricolazioniComponent } from './componenti/immatricolazioni/immatricolazioni.component';
import { NavbarComponent } from './sharepages/navbar/navbar.component';
import { TableComponent } from './componenti/table/table.component';
import { EuropeanNumberPipe } from './pipe/european-number.pipe';
import { DatePipe } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    MotoComponent,
    ImmatricolazioniComponent,
    NavbarComponent,
    TableComponent,
    EuropeanNumberPipe,
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    NgbNavModule,
    HttpClientModule,
  ],
})
export class AppModule {}
