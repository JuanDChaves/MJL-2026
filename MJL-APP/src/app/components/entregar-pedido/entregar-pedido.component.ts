import { Component, OnInit } from '@angular/core';
import { PedidosSectoresService } from 'src/app/services/pedidos-sectores.service';
import { ActivatedRoute } from '@angular/router';
import { LayoutComponent } from '../layout/layout.component';
import { DatePipe, UpperCasePipe } from '@angular/common';
import { NotificationsService } from 'src/app/services/notifications-service';
import {
  IonCard, IonCardContent, IonButton,
  IonCardHeader, IonCardTitle, IonCardSubtitle
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-entregar-pedido',
  templateUrl: './entregar-pedido.component.html',
  styleUrls: ['./entregar-pedido.component.scss'],
  imports: [
    IonCard, IonCardContent, IonButton,
    IonCardHeader, IonCardSubtitle, IonCardTitle,
    LayoutComponent, DatePipe, UpperCasePipe
  ]
})
export class EntregarPedidoComponent implements OnInit {
  rolEmpleado: string = 'cocinero';
  pedidosPreparando: any[] = [];
  pedidosHechos: any[] = [];

  constructor(
    private pedidosService: PedidosSectoresService,
    private route: ActivatedRoute,
    private notiService: NotificationsService 
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['rol']) {
        this.rolEmpleado = params['rol'];
      }
      this.cargarPedidos();
    });
  }

  async cargarPedidos() {
    const todosLosPedidos = await this.pedidosService.obtenerPedidosPorSector(this.rolEmpleado);

    // Preparando: Los más viejos arriba (Ascendente)
    this.pedidosPreparando = todosLosPedidos
      .filter(p => p.estadoSector === 'preparando')
      .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());

    // Hechos: Los más viejos abajo (Descendente)
    this.pedidosHechos = todosLosPedidos
      .filter(p => p.estadoSector === 'hecho')
      .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
  }

  async entregarPedido(pedido: any) {
    // Pasa los productos de este sector a 'hecho'
    const exito = await this.pedidosService.cambiarEstadoProductosPorSector(pedido, 'hecho');
    
    if(exito) {
      // Disparamos la notificación al mozo
      const sectorEnum = this.rolEmpleado === 'cantinero' ? 'bebida' : 'plato';
      await this.notiService.pedidoterminado(sectorEnum as any);
      
      // Recargamos la lista
      this.cargarPedidos();
    }
  }
}