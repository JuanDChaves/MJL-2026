import { Component, inject, OnInit, signal } from '@angular/core';
import { addIcons } from 'ionicons';
import { checkmark, close, checkmarkCircle } from 'ionicons/icons';
import { LayoutComponent } from '../../layout/layout.component';
import { IonAvatar, IonButton, IonCard, IonCardContent, IonIcon, ViewWillEnter } from '@ionic/angular/standalone';
import { DatePipe } from '@angular/common';
import { EstadoPedido, IPedido } from 'src/app/interfaces/IPedido';
import { SupabaseService } from 'src/app/services/supabase-service';
import { DbService } from 'src/app/services/db-service';
import { PedidosService } from 'src/app/services/pedidos-service';

@Component({
  selector: 'app-predidos-preparados',
  templateUrl: './predidos-preparados.component.html',
  styleUrls: ['./predidos-preparados.component.scss'],
  imports: [
    IonCard,
    IonCardContent,
    IonAvatar,
    IonButton,
    IonIcon,
    DatePipe,
    LayoutComponent
  ]
})
export class PredidosPreparadosComponent  implements ViewWillEnter {
  pedidosPreparadosList = signal<IPedido[]>([]);
  supabaseService = inject(SupabaseService);
  dbService = inject(DbService);
  pedidosServicio = inject(PedidosService)

  constructor() {
    addIcons({ checkmark, close, checkmarkCircle });
  }

  async ionViewWillEnter(): Promise<void> {
    await this.cargarPedidosPreparados();
  }

  async aprobarPedido(pedido: IPedido) {
    const response = await this.dbService.update('pedidos', 'id', pedido.id, { estado: EstadoPedido.Entregado})
    if (response.error) {
      console.error("Error al aprobar el pedido: ", response.error)
      return;
    }
    await this.cargarPedidosPreparados();
  }

  // FALTA CREAR EL ESTADO PREVIO A PENDIENTE
  async rechazarPedido(pedido: IPedido) {
    const response = await this.dbService.update('pedidos', 'id', pedido.id, { estado: EstadoPedido.Preparando})
    if (response.error) {
      console.error("Error al rechazar el pedido: ", response.error)
      return;
    }
    await this.cargarPedidosPreparados();
  }

  private async cargarPedidosPreparados() {
    const pedidos: IPedido[] = await this.pedidosServicio.cargarPedidos();
    this.pedidosPreparadosList.set(
      pedidos.filter(pedido => pedido.estado === 'hecho')
    );

    //console.log(pedidos)
  }
}
