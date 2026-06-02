import { Component, inject, signal } from '@angular/core';
import { addIcons } from 'ionicons';
import { checkmark, close, checkmarkCircle } from 'ionicons/icons';
import { LayoutComponent } from '../../layout/layout.component';
import { IonAvatar, IonButton, IonCard, IonCardContent, IonIcon, ViewWillEnter } from '@ionic/angular/standalone';
import { OrdersService } from 'src/app/services/orders-service';
import { TypeOrderState } from 'src/app/types/TypeOrderState';
import { IOrder } from 'src/app/interfaces/IOrder';

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
    LayoutComponent
  ]
})
export class PredidosPreparadosComponent  implements ViewWillEnter {
  pedidosPreparadosList = signal<IOrder[]>([]);
  orderService = inject(OrdersService)

  constructor() {
    addIcons({ checkmark, close, checkmarkCircle });
  }

  async ionViewWillEnter(): Promise<void> {
    await this.cargarPedidosPreparados();
  }

  async servirPedido(pedido: IOrder) {
    console.log('1. Apretaste el botón. ID del pedido es:', pedido.id);
    
    // Llamamos a Supabase
    const response = await this.orderService.deliverOrder(pedido);
    
    console.log('2. Supabase respondió esto:', response);

    if (response.error) {
      console.error('3. ERROR en la base de datos: ', response.error);
      return;
    }
    
    // Borrado visual optimista
    this.pedidosPreparadosList.update(pedidos => pedidos.filter(p => p.id !== pedido.id));
  }
  // FALTA CREAR EL ESTADO PREVIO A PENDIENTE
  async rechazarPedido(pedido: IOrder) {
    const response = await this.orderService.rejectOrder(pedido);
    if (response.error) {
      console.error('Error al rechazar el pedido: ', response.error);
      return;
    }
    await this.cargarPedidosPreparados();
  }

  private async cargarPedidosPreparados() {
    const result = await this.orderService.getOrdersWithStateFilter(TypeOrderState.Hecho);
    if(result.success) {
      this.pedidosPreparadosList.set(result.data!);
    }
    //console.log(pedidos)
  }
}
