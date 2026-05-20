import {
  Component,
  inject,
  signal,
  WritableSignal,
} from '@angular/core';
import { LayoutComponent } from '../../layout/layout.component';
import {
  IonAvatar,
  IonButton,
  IonCard,
  IonCardContent,
  IonIcon,
  IonBadge,
  ViewWillEnter,
} from '@ionic/angular/standalone';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { OrdersService } from 'src/app/services/orders-service';
import { IOrder } from 'src/app/interfaces/IOrder';

@Component({
  selector: 'app-detalle-pedido',
  templateUrl: './detalle-pedido.component.html',
  styleUrls: ['./detalle-pedido.component.scss'],
  imports: [
    IonCard,
    IonCardContent,
    IonAvatar,
    IonButton,
    IonBadge,
    IonIcon,
    DatePipe,
    LayoutComponent,
  ],
})
export class DetallePedidoComponent implements ViewWillEnter {
  pedidoId: WritableSignal<string> = signal('');
  pedido: WritableSignal<IOrder | null> = signal(null);
  orderService = inject(OrdersService);

  constructor(private route: ActivatedRoute) {}

  async ionViewWillEnter(): Promise<void> {
    await this.loadOrder();
  }

  async loadOrder() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;
    this.pedidoId.set(id);
    const response = await this.orderService.getOneOrder(id);
    if (!response.success) {
      // TODO: manejar error
      console.log(response.error?.message);
      return;
    }
    if (response.data === null) {
      // TODO: manejar error
      console.log('No se encontro el pedido');
      return;
    }
    const data = response.data;
    this.pedido.set(data);
    console.log(this.pedidoId());
  }
}
