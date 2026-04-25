import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonButton } from "@ionic/angular/standalone";

@Component({
  selector: 'app-pedidos-pendientes',
  templateUrl: './pedidos-pendientes.component.html',
  styleUrls: ['./pedidos-pendientes.component.scss'],
  imports: [IonButton, RouterLink]
})
export class PedidosPendientesComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
