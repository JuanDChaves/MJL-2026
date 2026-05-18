import { Component, inject, OnInit, signal } from '@angular/core';
import {
  IonIcon,
  ViewWillEnter,
  IonButton,
  IonAvatar,
  IonCardContent,
  IonCard,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmark, checkmarkCircle, close } from 'ionicons/icons';
import { LayoutComponent } from 'src/app/components/layout/layout.component';
import { ClienteEnEspera } from 'src/app/interfaces/ClienteEnEspera';
import { OrdersService } from 'src/app/services/orders-service';

@Component({
  selector: 'app-lista-espera',
  templateUrl: './lista-espera.component.html',
  styleUrls: ['./lista-espera.component.scss'],
  imports: [
    LayoutComponent,
    IonIcon,
    IonButton,
    IonAvatar,
    IonCardContent,
    IonCard,
  ],
})
export class ListaEsperaComponent implements ViewWillEnter {
  clientesEnEsperaList = signal<ClienteEnEspera[]>([]);
  ordersService = inject(OrdersService);

  
  constructor() {
    addIcons({ checkmark, close, checkmarkCircle });
  }
  
  async ionViewWillEnter(): Promise<void> {
    await this.cargarclientesEnEsperaList();
  }

  async cargarclientesEnEsperaList(): Promise<void> {
    const response = await this.ordersService.waitingCustomer();
  }

  asignarMesa(_t4: any) {
    throw new Error('Method not implemented.');
  }
}
