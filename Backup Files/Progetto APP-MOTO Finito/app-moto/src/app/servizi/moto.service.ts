import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Moto } from '../models/moto';

@Injectable({
  providedIn: 'root',
})
export class MotoService {
  url: string = 'http://localhost:8080/RestApiMyBatis/webapi/moto';

  constructor(private http: HttpClient) {}

  insertMoto(body: Moto) {
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

  getMotoById(id: number) {
    return this.http.get(this.url + id);
  }
  getMotos(url: string) {
    return this.http.get(url);
  }
  getMotosExcel(url: string, body) {
    return this.http.get(url, body);
  }
  getMotoPdf(id: number, body) {
    return this.http.get(this.url + '/' + id + '/exportMotoToPdf', body);
  }

  putMoto(body: Moto) {
    return new Promise((resolve) => {
      this.http.put(this.url + '/' + body.idMoto, body).subscribe({
        next: () => {
          resolve(true);
        },
        error: () => {
          resolve(false);
        },
      });
    });
  }

  deleteMoto(id: number) {
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
