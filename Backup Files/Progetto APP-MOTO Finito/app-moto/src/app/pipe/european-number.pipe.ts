// european-number.pipe.ts

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'europeanNumber',
})
export class EuropeanNumberPipe implements PipeTransform {
  transform(value: number): string {
    if (value != null) {
      // "it-EU" Formatta il numero con i punti per le migliaia e la virgola per il decimale
      return value.toLocaleString('it-EU', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    } else {
      return null;
    }
  }
}
