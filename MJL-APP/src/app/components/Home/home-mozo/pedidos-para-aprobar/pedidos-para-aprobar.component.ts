import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonButton } from "@ionic/angular/standalone";

@Component({
  selector: 'app-pedidos-para-aprobar',
  templateUrl: './pedidos-para-aprobar.component.html',
  styleUrls: ['./pedidos-para-aprobar.component.scss'],
  imports: [IonButton, RouterLink]
})
export class PedidosParaAprobarComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
