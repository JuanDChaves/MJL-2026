import { Component, inject } from '@angular/core';
import { IonButton, IonIcon, ViewWillEnter } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  qrCodeOutline,
  enterOutline,
  clipboardOutline,
  documentTextOutline,
} from 'ionicons/icons';
import { LayoutComponent } from '../../../layout/layout.component';
import { BarcodeScannerService } from '../../../../services/barcode-scanner-service';
import { Router } from '@angular/router';
import { ClientService } from 'src/app/services/client-service';
import { UserService } from 'src/app/services/user-service';
import { MesaService } from 'src/app/services/mesa-service';
import { IDatosMesaParaQr } from 'src/app/interfaces/IDatosMesaParaQr';
import { NotificationsService } from 'src/app/services/notifications-service';
import { LocalStorageService } from 'src/app/services/local-storage-service';
import { OrdersService } from 'src/app/services/orders-service';
import { ToastService } from 'src/app/services/toast-service';

@Component({
  selector: 'app-pantalla-ingreso-local',
  templateUrl: './pantalla-ingreso-local.component.html',
  styleUrls: ['./pantalla-ingreso-local.component.scss'],
  imports: [IonButton, IonIcon, LayoutComponent],
})
export class PantallaIngresoLocalComponent implements ViewWillEnter {
  private scannerService = inject(BarcodeScannerService);
  clientService = inject(ClientService);
  router = inject(Router);
  userService = inject(UserService);
  mesaService = inject(MesaService);
  notiService = inject(NotificationsService);
  localStorageService = inject(LocalStorageService);
  orderService = inject(OrdersService);
  toastService = inject(ToastService);

  constructor() {
    addIcons({
      qrCodeOutline,
      enterOutline,
      clipboardOutline,
      documentTextOutline,
    });
  }
  async ionViewWillEnter(): Promise<void> {
    await this.userService.loadUserData();
  }

  async anunciarse() {
    const user = this.userService.userData();
    if (user) {
      const response = await this.clientService.insertWaitingList(user);
      if (response.success) {
        console.log('cliente ingresado en la lista de espera');
        await this.notiService.ingresoListaEspera(user);
        return;
      }
      await this.toastService.showError(response.error?.message!);
      return;
    }
  }

  async escanearQR() {
    try {
      const response = await this.scannerService.scanQrGeneric();
      const mesaData = JSON.parse(response!);
      mesaData as IDatosMesaParaQr;
      const resultMesa = await this.mesaService.chequearMesaAsignada(
        mesaData.numero_mesa,
      );
      console.log(resultMesa);
      if (!resultMesa.success) {
        await this.toastService.showError(resultMesa.error?.message || 'Error al obtener mesa');
        return;
      }
      const mesa = resultMesa.data!;
      if (mesa.cliente?.dni !== this.userService.userData()?.dni) {
        let messageError = 'No es tu mesa asignada';
        if(mesa.ocupada){
          messageError = 'Mesa ocupada';
        }
        await this.toastService.showError(messageError);
        return;
      }

      const id_pedido = await this.localStorageService.getData<{id: string;}>('id_pedido');
      if (id_pedido && id_pedido.id ) {
        const resultOrder = await this.orderService.getOneOrder(id_pedido!.id);
        if (!resultOrder.success) {
          await this.toastService.showError(resultOrder.error?.message!);
          return;
        }
        if (
          resultOrder.data?.estado === 'preparando' ||
          resultOrder.data?.estado === 'hecho' ||
          resultOrder.data?.estado === 'entregado' ||
          resultOrder.data?.estado === 'pendiente'
        ) {
          this.router.navigate(['/detalle-pedido', id_pedido?.id]);
          return;
        }
      }

      //mostrar algun mensaje de exito
      this.router.navigate(['/menu-clientes']);
    } catch (error) {
      console.log(error);
    }
  }

  verEncuestas() {
    this.router.navigate(['/ver-encuesta']);
  }
  
}
