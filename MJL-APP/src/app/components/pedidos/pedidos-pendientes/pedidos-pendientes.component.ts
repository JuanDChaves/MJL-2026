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
import { Router } from '@angular/router';

@Component({
  selector: 'app-pedidos-pendientes',
  templateUrl: './pedidos-pendientes.component.html',
  styleUrls: ['./pedidos-pendientes.component.scss'],
  imports: [
    IonCard,
    IonCardContent,
    IonAvatar,
    IonButton,
    IonIcon,
    DatePipe,
    LayoutComponent]
})

export class PedidosPendientesComponent  implements ViewWillEnter {
  pedidosPendientesList = signal<IPedido[]>([]);
  supabaseService = inject(SupabaseService);
  dbService = inject(DbService);
  pedidosService = inject(PedidosService);
  router = inject(Router);

  constructor() {
    addIcons({ checkmark, close, checkmarkCircle });
  }

  async ionViewWillEnter(): Promise<void> {
    await this.cargarPedidosPendientes();
  }

  async aprobarPedido(pedido: IPedido) {
    const response = await this.dbService.update('pedidos', 'id', pedido.id, { estado: EstadoPedido.Preparando})
    if (response.error) {
      console.error("Error al aprobar el pedido: ", response.error)
      return;
    }
    await this.cargarPedidosPendientes();
  }

  async rechazarPedido(pedido: IPedido) {
    const response = await this.dbService.update('pedidos', 'id', pedido.id, { estado: EstadoPedido.Preparando})
    if (response.error) {
      console.error("Error al rechazar el pedido: ", response.error)
      return;
    }
    await this.cargarPedidosPendientes();
  }

  irAPedido(pedido: IPedido) {
    this.router.navigate(['/detalle-pedido', pedido.id]);
  }

  private async cargarPedidosPendientes() {
    const pedidos: IPedido[] = await this.pedidosService.cargarPedidos();
    this.pedidosPendientesList.set(
      pedidos.filter(pedido => pedido.estado === 'pendiente')
    );
  }
}
