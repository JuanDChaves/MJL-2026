import { Component, inject, signal } from '@angular/core';
import { addIcons } from 'ionicons';
import { checkmark, close, checkmarkCircle } from 'ionicons/icons';
import { LayoutComponent } from '../../layout/layout.component';
import { IonAvatar, IonButton, IonCard, IonCardContent, IonIcon, ViewWillEnter } from '@ionic/angular/standalone';
import { EstadoPedido, IPedido } from 'src/app/interfaces/IPedido';
import { SupabaseService } from 'src/app/services/supabase-service';
import { DbService } from 'src/app/services/db-service';
import { PedidosService } from 'src/app/services/pedidos-service';
import { OrdersService } from 'src/app/services/orders-service';

@Component({
  selector: 'app-pedidos-en-preparacion',
  templateUrl: './pedidos-en-preparacion.component.html',
  styleUrls: ['./pedidos-en-preparacion.component.scss'],
  imports: [
    IonCard,
    IonCardContent,
    IonAvatar,
    IonButton,
    IonIcon,
    LayoutComponent
  ]
})

export class PedidosEnPreparacionComponent  implements ViewWillEnter {
  pedidosEnPreparacionList = signal<IPedido[]>([]);
  supabaseService = inject(SupabaseService);
  dbService = inject(DbService);
  pedidosService = inject(PedidosService)
  orderService = inject(OrdersService)

  constructor() {
    addIcons({ checkmark, close, checkmarkCircle });
  }

  async ionViewWillEnter(): Promise<void> {
    await this.cargarPedidosEnPreparacion();
  }

  async aprobarPedido(pedido: IPedido) {
    const response = await this.dbService.update('pedidos', 'id', pedido.id, { estado: EstadoPedido.Hecho})
    if (response.error) {
      console.error("Error al aprobar el pedido: ", response.error)
      return;
    }
    await this.cargarPedidosEnPreparacion();
  }

  // FALTA CREAR EL ESTADO PREVIO A PENDIENTE
  async rechazarPedido(pedido: IPedido) {
    const response = await this.dbService.update('pedidos', 'id', pedido.id, { estado: EstadoPedido.Pendiente})
    if (response.error) {
      console.error("Error al rechazar el pedido: ", response.error)
      return;
    }
    await this.cargarPedidosEnPreparacion();
  }

  private async cargarPedidosEnPreparacion() {
    const pedidos: IPedido[] = await this.pedidosService.cargarPedidos();
    this.pedidosEnPreparacionList.set(
      pedidos.filter(pedido => pedido.estado === 'preparando')
    );
    console.log(pedidos)
  }
}

