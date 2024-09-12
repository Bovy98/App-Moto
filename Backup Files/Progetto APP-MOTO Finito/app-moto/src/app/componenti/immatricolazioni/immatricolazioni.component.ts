import { Component, OnInit } from '@angular/core';
import { ImmatricolazioniService } from 'src/app/servizi/immatricolazioni.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from 'src/app/servizi/toast.service';
import { HttpHeaders } from '@angular/common/http';
import { Immatricolazioni } from 'src/app/models/immatricolazioni';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-immatricolazioni',
  templateUrl: './immatricolazioni.component.html',
  styleUrls: ['./immatricolazioni.component.css'],
})
export class ImmatricolazioniComponent implements OnInit{
  immatricolazioniPostForm: FormGroup = new FormGroup({
    idImmatricolazione: new FormControl(null),
    targa: new FormControl(null, Validators.required),
    idMoto: new FormControl(null, Validators.required),
    dataImmatricolazione: new FormControl(null),
  });
  immatricolazioniGetForm: FormGroup = new FormGroup({
    idImmatricolazione: new FormControl(),
    targa: new FormControl(),
    idMoto: new FormControl(),
    dataImmatricolazioneFrom: new FormControl(),
    dataImmatricolazioneTo: new FormControl(),
  });
  immatricolazioniPutForm: FormGroup = new FormGroup({
    idImmatricolazione: new FormControl(null, Validators.required),
    targa: new FormControl(null, Validators.required),
    idMoto: new FormControl(null, Validators.required),
    dataImmatricolazione: new FormControl(null, Validators.required),
  });

  immatricolazioni: any;

  immatricolazioniArray: Immatricolazioni[] = [];

  serverOffset: number = 0;

  serverLimit: number = 20;

  page: number = 1;

  pageSize: number = 4;

  collectionSize: number;

  idToDelete: number;

  immatricolazioniPerPage: Immatricolazioni[];

  totaleRecord: number;

  immatricolazioniArrayTOT: Immatricolazioni[] = [];

  arrayOrdinato: Immatricolazioni[];

  constructor(
    private immatricolazioniService: ImmatricolazioniService,
    private modalService: NgbModal,
    protected toastService: ToastService,
    protected datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.searchByExample(); //lo metto nell' onInit cosi' mi mostra subito la table piena
  }

  openModal(content: any) {
    this.modalService.open(content);
  }

  closeAllModals() {
    this.modalService.dismissAll();
  }

  immatricolazioniPost() {
    if (this.immatricolazioniPostForm.valid) {
      //   let date = new Date();
      //   console.log('prima: ', date);
      //   let formattedDate = this.datePipe.transform(date, 'yyyy-MM-dd:THH:mm:ss');
      //   console.log('dopo: ', formattedDate);

      let date = new Date();

      let dateNotFormatted = date.toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });

      console.log('dateNotFormatted: ', dateNotFormatted);

      let arr = dateNotFormatted.split(',');

      let datePartBegin = arr[0];

      let timePart = arr[1].substring(1, 10);

      let dateSinglePart = datePartBegin.split('/');

      let datePartEnd =
        dateSinglePart[2] + '-' + dateSinglePart[0] + '-' + dateSinglePart[1];

      let formattedDateTime = datePartEnd + 'T' + timePart;

      //   console.log('part0giorno: ', dateSinglePart[0]);
      //   console.log('part1mese: ', dateSinglePart[1]);
      //   console.log('part2anno: ', dateSinglePart[2]);
      //   console.log('datePartBegin: ', datePartBegin);
      //   console.log('datePartEnd: ', datePartEnd);
      //   console.log('timePart: ', timePart);
      //   console.log('formattedDateTime: ', formattedDateTime);

      this.immatricolazioniPostForm
        .get('dataImmatricolazione')
        .setValue(formattedDateTime.trim()); //: OCCHIO LO SPAZIO SPACCA TUTTO
      //   console.log(
      //     'localeString:',
      //     date.toLocaleString('it-IT', {
      //       year: '2-digit',
      //       month: '2-digit',
      //       day: '2-digit',
      //       hour: '2-digit',
      //       minute: '2-digit',
      //       second: '2-digit',
      //     })
      //   );

      let immatricolazione: Immatricolazioni =
        this.immatricolazioniPostForm.value;

      this.immatricolazioniService
        .insertImmatricolazione(immatricolazione)
        .then((data) => {
          if (data == true) {
            console.log(data);
            this.showPostSuccess();
            this.searchByExample();
          } else if (data == false) {
            this.showPostDanger();
          }
        });
      this.closeAllModals();
      this.immatricolazioniPostForm.reset();
    }
  }

  getImmatricolazioneById(): void {
    this.immatricolazioni = this.immatricolazioniService
      .getImmatricolazioniById(
        this.immatricolazioniGetForm.value.idImmatricolazione
      )
      .subscribe((data: Immatricolazioni) => {
        console.log('immatricolazione trovata: ', data);
      });
  }

  searchByExample() {
    let url = 'http://localhost:8080/RestApiMyBatis/webapi/immatricolazioni?';

    console.log('serverOffset start-> ', this.serverOffset);
    console.log('serverLimit start-> ', this.serverLimit);

    if (this.immatricolazioniGetForm.value.targa) {
      url += 'targa=' + this.immatricolazioniGetForm.value.targa + '&';
    }
    if (this.immatricolazioniGetForm.value.idMoto) {
      url += 'idMoto=' + this.immatricolazioniGetForm.value.idMoto + '&';
    }
    if (this.immatricolazioniGetForm.value.dataImmatricolazioneFrom) {
      url +=
        'dataImmatricolazioneFrom=' +
        this.immatricolazioniGetForm.value.dataImmatricolazioneFrom +
        '&';
    }
    if (this.immatricolazioniGetForm.value.dataImmatricolazioneTo) {
      url +=
        'dataImmatricolazioneTo=' +
        this.immatricolazioniGetForm.value.dataImmatricolazioneTo +
        '&';
    }
    if (this.serverOffset != null) {
      url += 'offset=' + this.serverOffset + '&';
    }
    if (this.serverLimit != null) {
      url += 'limit=' + this.serverLimit + '&';
    }

    console.log('url: ', url);

    this.immatricolazioniService
      .getImmatricolazioni(url)
      .subscribe((data: any) => {
        this.immatricolazioniArrayTOT = data.listaImmatricolazioni;
        this.immatricolazioniArray = this.immatricolazioniArrayTOT.slice(
          (this.page - 1) * this.pageSize,
          (this.page - 1) * this.pageSize + this.pageSize
        );
        this.totaleRecord = data.totaleRecord;
        this.immatricolazioniPerPage = this.immatricolazioniArray;
        console.log(
          'this immatricolazioniArrayTOT: ',
          this.immatricolazioniArrayTOT
        );
      });
  }

  //LOGICA DEI TOAST
  showPostSuccess() {
    this.toastService.show('Immatricolazione aggiunta con successo', {
      classname: 'bg-success text-light',
      delay: 10000,
    });
  }
  showPutSuccess() {
    this.toastService.show('Immatricolazione modiificata con successo', {
      classname: 'bg-success text-light',
      delay: 5000,
    });
  }
  showDeleteSuccess() {
    this.toastService.show('Immatricolazione rimossa con successo', {
      classname: 'bg-success text-light',
      delay: 10000,
    });
  }

  showPostDanger() {
    this.toastService.show('Errore, immatricolazione non inserita', {
      classname: 'bg-danger text-light',
      delay: 5000,
    });
  }
  showPutDanger() {
    this.toastService.show('Errore, immatricolazione non modificata', {
      classname: 'bg-danger text-light',
      delay: 5000,
    });
  }
  showDeleteDanger() {
    this.toastService.show('Errore, immatricolazione non eliminata', {
      classname: 'bg-danger text-light',
      delay: 5000,
    });
  }

  ngOnDestroy(): void {
    this.toastService.clear();
  }

  isTemplate(toast) {
    return toast.textOrTpl instanceof ImmatricolazioniComponent;
  }

  openEditModal(content: any, immatricolazione: Immatricolazioni) {
    this.immatricolazioniPutForm.patchValue(immatricolazione);
    this.modalService.open(content);
  }

  modifyImmatricolazione() {
    if (this.immatricolazioniPutForm.valid) {
      let immatricolazione: Immatricolazioni =
        this.immatricolazioniPutForm.value;
      console.log(immatricolazione);
      this.immatricolazioniService
        .putImmatricolazioni(immatricolazione)
        .then((data) => {
          if (data == true) {
            console.log(data);
            this.showPutSuccess();
            this.searchByExample();
          } else if (data == false) {
            this.showPutDanger();
          }
        });
      this.closeAllModals();
    }
  }

  openDeleteModal(content: any, id: number) {
    this.modalService.open(content);
    this.idToDelete = id;
  }

  deleteImmatricolazione() {
    this.immatricolazioniService
      .deleteImmatricolazioni(this.idToDelete)
      .then((data) => {
        if (data == true) {
          console.log(data);
          this.showDeleteSuccess();
          this.searchByExample();
        } else if (data == false) {
          console.log(data);
          this.showDeleteDanger();
        }
      });
  }

  // ORDINAMENTO DELLE COLONNE

  orderByTargaAsc() {
    let arrayOrdinato = this.immatricolazioniArrayTOT.sort((a, b) => {
      return a.targa.localeCompare(b.targa);
    });
    console.log('arrayOrdinato: ', arrayOrdinato);
  }
  orderByTargaDesc() {
    let arrayOrdinato = this.immatricolazioniArrayTOT.sort((a, b) => {
      return a.targa.localeCompare(b.targa);
    });

    let arrayDesc = arrayOrdinato.reverse();
    console.log('arrayOrdinato: ', arrayOrdinato);
    console.log('arrayOrdinatoReverse: ', arrayDesc);
  }
  orderByIdMotoAsc() {
    let arrayOrdinato = this.immatricolazioniArrayTOT.sort((a, b) => {
      return a.idMoto - b.idMoto;
    });
    console.log('arrayOrdinato: ', arrayOrdinato);
  }
  orderByIdMotoDesc() {
    let arrayOrdinato = this.immatricolazioniArrayTOT.sort((a, b) => {
      return a.idMoto - b.idMoto;
    });
    let arrayDesc = arrayOrdinato.reverse();
    console.log('arrayOrdinato: ', arrayOrdinato);
    console.log('arrayOrdinatoReverse: ', arrayDesc);
  }
  orderByDataAsc() {
    let arrayOrdinato = this.immatricolazioniArrayTOT.sort((a, b) => {
      return a.dataImmatricolazione.localeCompare(b.dataImmatricolazione);
    });
    console.log('arrayOrdinato: ', arrayOrdinato);
  }
  orderByDataDesc() {
    let arrayOrdinato = this.immatricolazioniArrayTOT.sort((a, b) => {
      return a.dataImmatricolazione.localeCompare(b.dataImmatricolazione);
    });

    arrayOrdinato.reverse();
    // console.log('arrayOrdinato: ', arrayOrdinato);
    this.arrayOrdinato = arrayOrdinato;
  }

  exportImmatricolazioniToExcel() {
    let url =
      'http://localhost:8080/RestApiMyBatis/webapi/immatricolazioni/exportImmatricolazioniToExcel?';

    if (this.immatricolazioniGetForm.value.targa) {
      url += 'targa=' + this.immatricolazioniGetForm.value.targa + '&';
    }
    if (this.immatricolazioniGetForm.value.idMoto) {
      url += 'idMoto=' + this.immatricolazioniGetForm.value.idMoto + '&';
    }
    if (this.immatricolazioniGetForm.value.dataImmatricolazioneFrom) {
      url +=
        'dataImmatricolazioneFrom=' +
        this.immatricolazioniGetForm.value.dataImmatricolazioneFrom +
        '&';
    }
    if (this.immatricolazioniGetForm.value.dataImmatricolazioneTo) {
      url +=
        'dataImmatricolazioneTo=' +
        this.immatricolazioniGetForm.value.dataImmatricolazioneTo +
        '&';
    }
    console.log('url export Excel: ', url);

    const filename: string = 'ImmatricolazioniExport.xls';
    const headers = new HttpHeaders().set('authorization', 'Bearer ');
    this.immatricolazioniService
      .getImmatricolazioniExcel(url, {
        headers,
        responseType: 'blob' as 'json',
      })
      .subscribe((response: any) => {
        let dataType = response.type;
        let binaryData = [];
        binaryData.push(response);
        let downloadLink = document.createElement('a');
        downloadLink.href = window.URL.createObjectURL(
          new Blob(binaryData, { type: dataType })
        );
        if (filename) downloadLink.setAttribute('download', filename);
        document.body.appendChild(downloadLink);
        downloadLink.click();
      });
  }

  exportImmatricolazioneToPdf(id: number) {
    console.log('url export pdf: ', this.immatricolazioniService.url);

    const filename: string = 'ImmatricolazioniReport.pdf';
    const headers = new HttpHeaders().set('authorization', 'Bearer ');
    this.immatricolazioniService
      .getImmatricolazioniPdf(id, { headers, responseType: 'blob' as 'json' })
      .subscribe((response: any) => {
        let dataType = response.type;
        let binaryData = [];
        binaryData.push(response);
        let downloadLink = document.createElement('a');
        downloadLink.href = window.URL.createObjectURL(
          new Blob(binaryData, { type: dataType })
        );
        if (filename) downloadLink.setAttribute('download', filename);
        document.body.appendChild(downloadLink);
        downloadLink.click();
      });
  }
}
