import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Immatricolazioni } from '../models/immatricolazioni';

@Injectable({
  providedIn: 'root',
})
export class ImmatricolazioniService {
  url: string = 'http://localhost:8080/RestApiMyBatis/webapi/immatricolazioni';

  constructor(private http: HttpClient) {}

  insertImmatricolazione(body: Immatricolazioni) {
    return new Promise((resolve) => {
      this.http.post(this.url, body).subscribe({
        next: () => {
          resolve(true);
        },
        error: (e) => {
          console.log(e);
          resolve(false);
        },
      });
    });
  }

  getImmatricolazioniById(id: number) {
    return this.http.get(this.url + id);
  }
  getImmatricolazioni(url: string) {
    return this.http.get(url);
  }
  getImmatricolazioniExcel(url: string, body) {
    return this.http.get(url, body);
  }
  getImmatricolazioniPdf(id: number, body) {
    return this.http.get(
      this.url + '/' + id + '/exportImmatricolazioniToPdf',
      body
    );
  }

  putImmatricolazioni(body: Immatricolazioni) {
    return new Promise((resolve) => {
      this.http.put(this.url + '/' + body.idImmatricolazione, body).subscribe({
        next: () => {
          resolve(true);
        },
        error: () => {
          resolve(false);
        },
      });
    });
  }

  deleteImmatricolazioni(id: number) {
    return new Promise((resolve) => {
      this.http.delete(this.url + '/' + id).subscribe({
        next: () => {
          resolve(true);
        },
        error: (e) => {
          console.log(e);
          resolve(false);
        },
      });
    });
  }
}
