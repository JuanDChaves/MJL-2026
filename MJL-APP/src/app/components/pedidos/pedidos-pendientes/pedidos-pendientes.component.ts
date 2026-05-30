import { Component, inject, signal } from '@angular/core';
import { addIcons } from 'ionicons';
import { checkmark, close, checkmarkCircle, timerOutline, personOutline, restaurantOutline } from 'ionicons/icons';
import { LayoutComponent } from '../../layout/layout.component';
import {
  IonButton,
  IonIcon,
  ViewWillEnter,
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { OrdersService } from 'src/app/services/orders-service';
import { IOrder } from 'src/app/interfaces/IOrder';
import { TypeOrderState } from 'src/app/types/TypeOrderState';
import { ProductsOrdersService } from 'src/app/services/products-orders-service';
import { NotificationsService } from 'src/app/services/notifications-service';
import { IProductToLoadIntoOrders } from 'src/app/interfaces/IProductToLoadIntoOrders';

@Component({
  selector: 'app-pedidos-pendientes',
  templateUrl: './pedidos-pendientes.component.html',
  styleUrls: ['./pedidos-pendientes.component.scss'],
  imports: [
    IonButton,
    IonIcon,
    LayoutComponent,
  ],
})
export class PedidosPendientesComponent implements ViewWillEnter {
  pedidosPendientesList = signal<IOrder[]>([]);
  router = inject(Router);
  orderService = inject(OrdersService);
  productOrderService = inject(ProductsOrdersService);
  notiService = inject(NotificationsService);

  constructor() {
    addIcons({ checkmark, close, checkmarkCircle, timerOutline, personOutline, restaurantOutline });
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

  getOrderRef(id: string): string {
    return id.slice(-5).toUpperCase();
  }

  calculateTotal(productos: IProductToLoadIntoOrders[]): number {
    return productos.reduce((sum, p) => sum + p.precio * p.cantidad, 0);
  }

  calculatePrepTime(productos: IProductToLoadIntoOrders[]): number {
    if (productos.length <= 2) {
      return Math.max(...productos.map(p => p.tiempo_elaboracion * p.cantidad));
    }
    const total = productos.reduce((sum, p) => sum + p.tiempo_elaboracion * p.cantidad, 0);
    return Math.round(total / 3);
  }

  formatPrice(price: number): string {
    return '$ ' + price.toLocaleString('es-AR');
  }

  private async cargarPedidosPendientes() {
    const result = await this.orderService.getOrdersWithStateFilter(TypeOrderState.Pendiente);
    if (result.success) {
      this.pedidosPendientesList.set(result.data!);
    }
  }
}
