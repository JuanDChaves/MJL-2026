import { Component, OnInit, Input, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  IonCard,
  IonCardContent,
  IonButton,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  ViewWillEnter

} from '@ionic/angular/standalone';
import { LayoutComponent } from '../layout/layout.component';
import { DatePipe } from '@angular/common';
import { ProductsOrdersService } from 'src/app/services/products-orders-service';

@Component({
  selector: 'app-preparar-pedido',
  templateUrl: './preparar-pedido.component.html',
  styleUrls: ['./preparar-pedido.component.scss'],
  imports: [
    IonCard,
    IonCardContent,
    IonButton,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    LayoutComponent,
    DatePipe
  ]
})
export class PrepararPedidoComponent implements ViewWillEnter {
  productOrders = inject(ProductsOrdersService);
  routeActivate = inject(ActivatedRoute);

  rolEmpleado = signal<string>('cocinero'); 
  
  pedidosPendientes: any[] = [];
  pedidosPreparando: any[] = [];

  ionViewWillEnter() {
    this.getRol();
  }

  async cargarPedidos() {
    
  }

  async aceptarPedido(pedido: any) {
   
  }

  getRol(){
    console.log(this.routeActivate.snapshot.queryParamMap.get('rol'));
  }
}