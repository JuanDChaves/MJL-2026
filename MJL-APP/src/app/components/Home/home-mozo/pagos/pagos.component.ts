import { Component, inject, signal } from '@angular/core';
import { ViewWillEnter } from '@ionic/angular';
import {
  IonCard,
  IonCardContent,
  IonAvatar,
  IonButton,
  IonBadge,
  IonIcon,
} from '@ionic/angular/standalone';
import { LayoutComponent } from "src/app/components/layout/layout.component";
import { addIcons } from 'ionicons';
import { cashOutline, checkmarkCircleOutline, walletOutline } from 'ionicons/icons';
import { IOrder } from 'src/app/interfaces/IOrder';
import { ClientService } from 'src/app/services/client-service';
import { LocalStorageService } from 'src/app/services/local-storage-service';
import { MesaService } from 'src/app/services/mesa-service';
import { NotificationsService } from 'src/app/services/notifications-service';
import { OrdersService } from 'src/app/services/orders-service';
import { TypeOrderState } from 'src/app/types/TypeOrderState';

@Component({
  selector: 'app-pagos',
  templateUrl: './pagos.component.html',
  styleUrls: ['./pagos.component.scss'],
  imports: [
    LayoutComponent,
    IonCard,
    IonCardContent,
    IonAvatar,
    IonButton,
    IonBadge,
    IonIcon,
  ],
})
export class PagosComponent implements ViewWillEnter {

  orderService = inject(OrdersService)
  paidOrders = signal<IOrder[]>([])
  mesaService = inject(MesaService)
  notiService = inject(NotificationsService)
  clientService = inject(ClientService)
  localStorageService = inject(LocalStorageService)

  constructor() {
    addIcons({ cashOutline, checkmarkCircleOutline, walletOutline });
  }

  async ionViewWillEnter(): Promise<void> {
    await this.loadPaidOrders();
  }

  async loadPaidOrders(): Promise<void> {
    const result = await this.orderService.getOrdersWithStateFilter(TypeOrderState.Pagado);
    if (result.success) this.paidOrders.set(result.data!);
  }

  getTotal(order: IOrder): number {
    return order.data.reduce((sum, p) => sum + p.precio * p.cantidad, 0);
  }

  async confirmPayment(order: IOrder) {
    const responseOrder = await this.orderService.confirmedPayment(order);
    if (!responseOrder.success) {
      console.log('error en la confirmacion del pago');
      return;
    }
    const responseClient = await this.clientService.clientById(order.id_cliente);
    if (!responseClient.success) {
      console.log('error al obtener el cliente para notificar');
      return;
    }
    await this.notiService.confirmacionPago(responseClient.data!);
    await this.mesaService.liberarMesa(order.numero_mesa);
    await this.loadPaidOrders();
  }

}
