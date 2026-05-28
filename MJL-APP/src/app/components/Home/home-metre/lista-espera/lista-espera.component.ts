import { Component, inject, signal } from '@angular/core';
import {
  IonIcon,
  ViewWillEnter,
  IonButton,
  IonAvatar,
  IonCardContent,
  IonCard,
  ModalController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmark, checkmarkCircle, close } from 'ionicons/icons';
import { LayoutComponent } from 'src/app/components/layout/layout.component';
import { ClienteEnEspera } from 'src/app/interfaces/ClienteEnEspera';
import { ClientService } from 'src/app/services/client-service';
import { MesaService } from 'src/app/services/mesa-service';
import { AsignarMesaModalComponent } from './asignar-mesa-modal/asignar-mesa-modal.component';
import { NotificationsService } from 'src/app/services/notifications-service';

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
  clientService = inject(ClientService);
  mesaService = inject(MesaService);
  modalCtrl = inject(ModalController);
  notiService = inject(NotificationsService);

  constructor() {
    addIcons({ checkmark, close, checkmarkCircle });
  }

  async ionViewWillEnter(): Promise<void> {
    await this.cargarclientesEnEsperaList();
  }

  async cargarclientesEnEsperaList(): Promise<void> {
    const response = await this.clientService.waitingCustomerList();
    if (response.success) {
      this.clientesEnEsperaList.set(response.data!);
    }
  }

  async asignarMesa(clienteEsperando: ClienteEnEspera) {
    console.log(clienteEsperando,'cliente recibido')
    const mesas = await this.mesaService.mesasDisponibles();
    if (!mesas.success || !mesas.data?.length) return;

    const modal = await this.modalCtrl.create({
      component: AsignarMesaModalComponent,
      componentProps: {
        clienteEsperando,
        mesasDisponibles: mesas.data,
      },
    });
    await modal.present();

    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm' && data) {
      await this.mesaService.asignarMesa(clienteEsperando.cliente, data.mesaElegida,clienteEsperando.id);
      await this.notiService.mesaAsingada(clienteEsperando.cliente, data.mesaElegida);
      await this.cargarclientesEnEsperaList();
    }
  }
}
