import { AfterContentInit, Component, OnInit } from '@angular/core';
import { MotoService } from 'src/app/servizi/moto.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Moto } from 'src/app/models/moto';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from 'src/app/servizi/toast.service';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-moto',
  templateUrl: './moto.component.html',
  styleUrls: ['./moto.component.css'],
})
export class MotoComponent implements OnInit, AfterContentInit {
  motoPostForm: FormGroup = new FormGroup({
    modello: new FormControl(null, Validators.required),
    cc: new FormControl(null, Validators.required),
    anno: new FormControl(null, Validators.required),
    prezzo: new FormControl(null, Validators.required),
  });
  motoGetForm: FormGroup = new FormGroup({
    modello: new FormControl(),
    ccDa: new FormControl(),
    ccA: new FormControl(),
    annoDa: new FormControl(),
    annoA: new FormControl(),
    prezzoDa: new FormControl(),
    prezzoA: new FormControl(),
  });
  motoPutForm: FormGroup = new FormGroup({
    idMoto: new FormControl(),
    modello: new FormControl(null, Validators.required),
    cc: new FormControl(null, Validators.required),
    anno: new FormControl(null, Validators.required),
    prezzo: new FormControl(null, Validators.required),
  });

  moto: any;

  motoArray: Moto[] = [];

  prezzoTotale: number;

  offset: number;

  limit: number;

  orderBy: string = 'anno';

  orderHow: string;

  currentPage: number = 1;

  itemsPerPage: number = 10;

  totalItems: number = this.count();

  idToDelete: number;

  constructor(
    private motoService: MotoService,
    private modalService: NgbModal,
    public toastService: ToastService
  ) {}
  ngAfterContentInit(): void {
    this.searchByExample(); //lo metto nell' onInit cosi' mi mostra subito la table piena
  }

  ngOnInit(): void {}

  openModal(content: any) {
    this.modalService.open(content);
  }

  closeAllModals() {
    this.modalService.dismissAll();
  }

  motoPost() {
    if (this.motoPostForm.valid) {
      let moto: Moto = this.motoPostForm.value; //*passo un oggetto Moto che compongo dal form
      this.motoService.insertMoto(moto).then((data) => {
        if (data == true) {
          console.log(data);
          this.showPostSuccess();
          this.searchByExample();
        } else if (data == false) {
          this.showPostDanger();
        }
      });
      this.closeAllModals();
      this.motoPostForm.reset();
    }
    //console.log(this.motoForm); //* OK
  }

  getMotoById(): void {
    this.moto = this.motoService
      .getMotoById(this.motoGetForm.value.idMoto)
      .subscribe((data: Moto) => {
        //*.subscribe(data: any)  -> resta in ascolto e ad ogni cambiamento/ricezione aggiornamento che viene rilevato mi ritorna un data
        // console.log("moto che sto cercando -> ",this.motoForm.value.id, this.motoForm.value.modello, this.motoForm.value.cc, this.motoForm.value.anno);
        //console.log("idMoto: " ,this.motoForm.value.id);

        console.log('moto trovata: ', data);
      });
  }

  searchByExample() {
    let url = 'http://localhost:8080/RestApiMyBatis/webapi/moto?';

    console.log('offset inizio RowB: ', this.offset);
    console.log('limit inizio RowB: ', this.limit);

    console.log('currentPage: ', this.currentPage);

    this.offset = (this.currentPage - 1) * this.itemsPerPage;
    this.limit = this.itemsPerPage;

    if (this.motoGetForm.value.modello) {
      url += 'model=' + this.motoGetForm.value.modello + '&';
    }
    if (this.motoGetForm.value.ccDa) {
      url += 'ccFrom=' + this.motoGetForm.value.ccDa + '&';
    }
    if (this.motoGetForm.value.ccA) {
      url += 'ccTo=' + this.motoGetForm.value.ccA + '&';
    }
    if (this.motoGetForm.value.annoDa) {
      url += 'yearProdFrom=' + this.motoGetForm.value.annoDa + '&';
    }
    if (this.motoGetForm.value.annoA) {
      url += 'yearProdTo=' + this.motoGetForm.value.annoA + '&';
    }
    if (this.motoGetForm.value.prezzoDa) {
      url += 'priceFrom=' + this.motoGetForm.value.prezzoDa + '&';
    }
    if (this.motoGetForm.value.prezzoA) {
      url += 'priceTo=' + this.motoGetForm.value.prezzoA + '&';
    }
    if (this.offset != null) {
      url += 'offset=' + this.offset + '&';
    }
    if (this.limit != null) {
      url += 'limit=' + this.limit + '&';
    }
    if (this.orderBy != null) {
      url += 'orderBy=' + this.orderBy + '&';
    }
    if (this.orderHow != null) {
      url += 'orderHow=' + this.orderHow + '&';
    }

    console.log('url: ', url);

    this.motoService.getMotos(url).subscribe((data: any) => {
      //per usare i dati ritornati dalla chiamata asincrona DEVO essere dentro al blocco del .subscribe, altrimenti non posso vedere i dati in quanto la chiamata potrebbe non essere stata ancora completata.
      console.log('moto trovate rowBounds: ', data);
      this.motoArray = data.listaMoto;
      this.prezzoTotale = data.sommaPrezzi;
      console.log('this totalItems', this.totalItems);
    });
  }

  count(): number {
    let url = 'http://localhost:8080/RestApiMyBatis/webapi/moto?';
    console.log('url: ', url);

    this.motoService.getMotos(url).subscribe((data: any) => {
      //per usare i dati ritornati dalla chiamata asincrona DEVO essere dentro al blocco del .subscribe, altrimenti non posso vedere i dati in quanto la chiamata potrebbe non essere stata ancora completata.
      console.log('moto totali: ', data.listaMoto);
      this.motoArray = data.listaMoto;
      this.totalItems = this.motoArray.length;
      console.log(this.totalItems);
    });
    return this.totalItems;
  }

  getModello() {
    //per accedere all'attributo modello del FormGroup
    console.log(this.motoPostForm.get('modello'));
  }

  //LOGICA DEL TOAST
  showStandard() {
    this.toastService.show('I am a standard toast');
  }

  showPostSuccess() {
    this.toastService.show('Moto aggiunta con successo', {
      classname: 'bg-success text-light',
      delay: 10000,
    });
  }
  showPutSuccess() {
    this.toastService.show('Moto modiificata con successo', {
      classname: 'bg-success text-light',
      delay: 5000,
    });
  }
  showDeleteSuccess() {
    this.toastService.show('Moto rimossa con successo', {
      classname: 'bg-success text-light',
      delay: 10000,
    });
  }

  showPostDanger() {
    this.toastService.show('Errore, moto non inserita', {
      classname: 'bg-danger text-light',
      delay: 5000,
    });
  }
  showPutDanger() {
    this.toastService.show('Errore, moto non modificata', {
      classname: 'bg-danger text-light',
      delay: 5000,
    });
  }
  showDeleteDanger() {
    this.toastService.show('Errore, moto non eliminata', {
      classname: 'bg-danger text-light',
      delay: 5000,
    });
  }

  ngOnDestroy(): void {
    this.toastService.clear();
  }

  isTemplate(toast) {
    return toast.textOrTpl instanceof MotoComponent;
  }

  openEditModal(content: any, moto: Moto) {
    this.motoPutForm.patchValue(moto); //prende tutti valori dell' oggetto moto e li mette dentro ai campi del form motoPutForm
    this.modalService.open(content);
  }

  modifyMoto() {
    if (this.motoPutForm.valid) {
      let moto: Moto = this.motoPutForm.value;
      console.log(moto);
      this.motoService.putMoto(moto).then((data) => {
        if (data == true) {
          console.log(data);
          this.showPutSuccess();
        } else if (data == false) {
          this.showPutDanger();
        }
      });
      this.searchByExample();
      this.closeAllModals();
    }
  }

  openDeleteModal(content: any, id: number) {
    this.modalService.open(content);
    this.idToDelete = id;
  }

  deleteMoto() {
    this.motoService.deleteMoto(this.idToDelete).then((data) => {
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

  orderByModelAsc() {
    this.orderBy = 'modello';
    this.orderHow = 'asc';
    this.searchByExample();
    this.orderBy = null;
    this.orderHow = null;
  }
  orderByModelDesc() {
    this.orderBy = 'modello';
    this.orderHow = 'desc';
    this.searchByExample();
    this.orderBy = null;
    this.orderHow = null;
  }
  orderByCcAsc() {
    this.orderBy = 'cc';
    this.orderHow = 'asc';
    this.searchByExample();
    this.orderBy = null;
    this.orderHow = null;
  }
  orderByCcDesc() {
    this.orderBy = 'cc';
    this.orderHow = 'desc';
    this.searchByExample();
    this.orderBy = null;
    this.orderHow = null;
  }
  orderByYearAsc() {
    this.orderBy = 'anno';
    this.orderHow = 'asc';
    this.searchByExample();
    this.orderBy = null;
    this.orderHow = null;
  }
  orderByYearDesc() {
    this.orderBy = 'anno';
    this.orderHow = 'desc';
    this.searchByExample();
    this.orderBy = null;
    this.orderHow = null;
  }
  orderByPriceAsc() {
    this.orderBy = 'prezzo';
    this.orderHow = 'asc';
    this.searchByExample();
    this.orderBy = null;
    this.orderHow = null;
  }
  orderByPriceDesc() {
    this.orderBy = 'prezzo';
    this.orderHow = 'desc';
    this.searchByExample();
    this.orderBy = null;
    this.orderHow = null;
  }

  exportMotoToExcel() {
    let url =
      'http://localhost:8080/RestApiMyBatis/webapi/moto/exportMotoToExcel?';

    if (this.motoGetForm.value.modello) {
      url += 'model=' + this.motoGetForm.value.modello + '&';
    }
    if (this.motoGetForm.value.ccDa) {
      url += 'ccFrom=' + this.motoGetForm.value.ccDa + '&';
    }
    if (this.motoGetForm.value.ccA) {
      url += 'ccTo=' + this.motoGetForm.value.ccA + '&';
    }
    if (this.motoGetForm.value.annoDa) {
      url += 'yearProdFrom=' + this.motoGetForm.value.annoDa + '&';
    }
    if (this.motoGetForm.value.annoA) {
      url += 'yearProdTo=' + this.motoGetForm.value.annoA + '&';
    }
    if (this.motoGetForm.value.prezzoDa) {
      url += 'priceFrom=' + this.motoGetForm.value.prezzoDa + '&';
    }
    if (this.motoGetForm.value.prezzoA) {
      url += 'priceTo=' + this.motoGetForm.value.prezzoA + '&';
    }
    if (this.orderBy != null) {
      url += 'orderBy=' + this.orderBy + '&';
    }
    if (this.orderHow != null) {
      url += 'orderHow=' + this.orderHow + '&';
    }

    console.log('url export Excel: ', url);

    const filename: string = 'MotoExport.xls';
    const headers = new HttpHeaders().set('authorization', 'Bearer ');
    this.motoService
      .getMotosExcel(url, { headers, responseType: 'blob' as 'json' })
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

  exportMotoToPdf(id: number) {
    console.log('url export pdf: ', this.motoService.url);

    const filename: string = 'MotoReport.pdf';
    const headers = new HttpHeaders().set('authorization', 'Bearer ');
    this.motoService
      .getMotoPdf(id, { headers, responseType: 'blob' as 'json' })
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
