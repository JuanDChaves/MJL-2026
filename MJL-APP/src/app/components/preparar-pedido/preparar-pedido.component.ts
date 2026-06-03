import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ViewWillEnter, IonButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmark } from 'ionicons/icons';
import { DatePipe } from '@angular/common';
import { LayoutComponent } from '../layout/layout.component';
import { ProductsOrdersService } from 'src/app/services/products-orders-service';
import { IPedidoEnPreparacion } from 'src/app/interfaces/IPedidoEnPreparacion';
import { ToastService } from 'src/app/services/toast-service';
import { NotificationsService } from 'src/app/services/notifications-service';
import { OrdersService } from 'src/app/services/orders-service';

@Component({
  selector: 'app-preparar-pedido',
  templateUrl: './preparar-pedido.component.html',
  styleUrls: ['./preparar-pedido.component.scss'],
  imports: [LayoutComponent, DatePipe, IonButton, IonIcon],
})
export class PrepararPedidoComponent implements ViewWillEnter {
  productOrders = inject(ProductsOrdersService);
  routeActivate = inject(ActivatedRoute);
  pedidos = signal<IPedidoEnPreparacion[]>([]);
  rolEmpleado = signal<string>('cocinero');
  toastService = inject(ToastService);
  notiService = inject(NotificationsService);
  orderService = inject(OrdersService)

  constructor() {
    addIcons({ checkmark });
  }

  async ionViewWillEnter(): Promise<void> {
    this.getRol();
    await this.cargarPedidos();
  }

  async cargarPedidos(): Promise<void> {
    if (this.rolEmpleado() === 'cocinero') {
      const result = await this.productOrders.getProductsCocina();
      if (result.error) {
        await this.toastService.showError(result.error.message!);
        return;
      }
      this.pedidos.set(result.data!);
    } else {
      const result = await this.productOrders.getProductsBarra();
      if (result.error) {
        await this.toastService.showError(result.error.message!);
        return;
      }
      this.pedidos.set(result.data!);
    }
  }

  getRol(): void {
    const rol = this.routeActivate.snapshot.queryParamMap.get('rol') ?? 'cocinero';
    this.rolEmpleado.set(rol);
  }

  async finishOrder(idPedido: string): Promise<void> {
    const tipo = this.rolEmpleado() === 'cocinero' ? 'plato' : 'bebida';
    const response = await this.productOrders.finishProducts(idPedido, tipo);
    if (response.error) {
      await this.toastService.showError(response.error.message!);
      return;
    }
    console.log(response.data,`${this.rolEmpleado()} terminado`);

    const isCompleted = await this.productOrders.isOrderCompleted(idPedido);

    if (isCompleted.error) {
      await this.toastService.showError(isCompleted.error.message!);
      return;
    }
    if (isCompleted.success) {
      console.log('pedido completado');
      const response_finish = await this.orderService.finishOrder(idPedido);
      if(response_finish.error) return await this.toastService.showError(response_finish.error.message!);
      await this.notiService.pedidoterminado(response_finish.data?.id_cliente!);
    }
    await this.cargarPedidos();
  }

  getTitle(): string {
    return this.rolEmpleado() === 'cocinero' ? '🍳 Cocina' : '🍸 Barra';
  }
}