import { Component, Input, OnInit } from '@angular/core';
import { Moto } from 'src/app/models/moto';
import { MotoComponent } from '../moto/moto.component';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
})
export class TableComponent implements OnInit {
  @Input() motoArray: Moto[];
  @Input() prezzoTotale: number;

  constructor(public motoComponent: MotoComponent) {}

  ngOnInit(): void {}
}
