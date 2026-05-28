import { Component, inject, signal } from '@angular/core';
import { addIcons } from 'ionicons';
import { checkmark, close, checkmarkCircle } from 'ionicons/icons';
import { LayoutComponent } from '../../layout/layout.component';
import {
  IonAvatar,
  IonButton,
  IonCard,
  IonCardContent,
  IonIcon,
  ViewWillEnter,
} from '@ionic/angular/standalone';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { OrdersService } from 'src/app/services/orders-service';
import { IOrder } from 'src/app/interfaces/IOrder';
import { TypeOrderState } from 'src/app/types/TypeOrderState';
import { ProductsOrdersService } from 'src/app/services/products-orders-service';
import { NotificationsService } from 'src/app/services/notifications-service';

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
    LayoutComponent,
  ],
})
export class PedidosPendientesComponent implements ViewWillEnter {
  pedidosPendientesList = signal<IOrder[]>([]);
  router = inject(Router);
  orderService = inject(OrdersService);
  productOrderService = inject(ProductsOrdersService)
  notiService = inject(NotificationsService)

  constructor() {
    addIcons({ checkmark, close, checkmarkCircle });
  }

  async ionViewWillEnter(): Promise<void> {
    await this.cargarPedidosPendientes();
  }

  async aprobarPedido(pedido: IOrder) {
    const response = await this.orderService.approveOrder(pedido);
    await this.notiService.confirmacionPedidoACliente(pedido.id_cliente);
    if (response.error) {
      console.error('Error al aprobar el pedido: ', response.error);
      return;
    }
    //subir a la tabla producto_pedidos
    const resultado = await this.productOrderService.insertProductsOrders(pedido);
    await this.notiService.enviarPedidoBar();
    await this.notiService.enviarPedidoCocina();
    console.log(resultado);
    await this.cargarPedidosPendientes();
  }

  async rechazarPedido(pedido: IOrder) {
    const response = await this.orderService.rejectOrder(pedido);
    await this.notiService.rechazaPedido(pedido.id_cliente);
    if (response.error) {
      console.error('Error al rechazar el pedido: ', response.error);
      return;
    }
    await this.cargarPedidosPendientes();
  }

  irAPedido(pedido: IOrder) {
    this.router.navigate(['/detalle-pedido', pedido.id]);
  }

  private async cargarPedidosPendientes() {
    const result = await this.orderService.getOrdersWithStateFilter(TypeOrderState.Pendiente);
    if (result.success) {
      this.pedidosPendientesList.set(result.data!);
    }
  }
}
