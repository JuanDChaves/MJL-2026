import { Component, inject, signal } from '@angular/core';
import {
  IonIcon,
  ViewWillEnter,
  IonButton,
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
import { ToastService } from 'src/app/services/toast-service';

@Component({
  selector: 'app-lista-espera',
  templateUrl: './lista-espera.component.html',
  styleUrls: ['./lista-espera.component.scss'],
  imports: [
    LayoutComponent,
    IonIcon,
    IonButton,
  ],
})
export class ListaEsperaComponent implements ViewWillEnter {
  clientesEnEsperaList = signal<ClienteEnEspera[]>([]);
  clientService = inject(ClientService);
  mesaService = inject(MesaService);
  modalCtrl = inject(ModalController);
  notiService = inject(NotificationsService);
  toastService = inject(ToastService);

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
      console.log(this.clientesEnEsperaList());
    }else {
      await this.toastService.showError(response.error?.message!);
    }
  }

  async asignarMesa(clienteEsperando: ClienteEnEspera) {
    console.log(clienteEsperando,'cliente recibido')
    const mesas = await this.mesaService.mesasDisponibles();
    if (!mesas.success || !mesas.data?.length) {
      return await this.toastService.showError(mesas.error?.message!);
    };

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
      const response_1 = await this.mesaService.asignarMesa(clienteEsperando.cliente, data.mesaElegida,clienteEsperando.id_lista_espera);
      if(!response_1.success) return await this.toastService.showError(response_1.error?.message!);
      const response_2 = await this.notiService.mesaAsingada(clienteEsperando.cliente, data.mesaElegida);
      if(!response_2.success) return await this.toastService.showError(response_2.error?.message!);
      await this.cargarclientesEnEsperaList();
    }
  }
}
