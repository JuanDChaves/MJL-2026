import { Component, inject } from '@angular/core';
import { IonButton, IonIcon, ViewWillEnter } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { qrCodeOutline, enterOutline, clipboardOutline, documentTextOutline } from 'ionicons/icons';
import { LayoutComponent } from '../../../layout/layout.component';
import { BarcodeScannerService } from '../../../../services/barcode-scanner-service';
import { Router } from '@angular/router';
import { ClientService } from 'src/app/services/client-service';
import { UserService } from 'src/app/services/user-service';
import { MesaService } from 'src/app/services/mesa-service';
import { IDatosMesaParaQr } from 'src/app/interfaces/IDatosMesaParaQr';
import { NotificationsService } from 'src/app/services/notifications-service';

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
  mesaService = inject(MesaService)
  notiService = inject(NotificationsService)

  constructor() {
    addIcons({ qrCodeOutline, enterOutline, clipboardOutline,documentTextOutline });
  }
  async ionViewWillEnter(): Promise<void> {
    await this.userService.loadUserData();
  }

  async anunciarse() {
    const user = this.userService.userData();
    if (user) {
      const response = await this.clientService.insertWaitingList(user);
      if(response.success) {
        console.log('cliente ingresado en la lista de espera');
        await this.notiService.ingresoListaEspera(user);
        return;
      }
      console.log(response.error);
      return;

    }
  }

  async escanearQR() {
    try {
      const response = await this.scannerService.scanQrGeneric();
      console.log(response);
      const mesaData = JSON.parse(response!) ;
      mesaData as IDatosMesaParaQr; 
      const result = await this.mesaService.chequearMesaAsignada(mesaData.numero_mesa);
      if(!result.success) {
        console.log(result.error?.message);
        return;
      }
      const mesa = result.data!;
      if(mesa.ocupada) {
        if(mesa.dni === this.userService.userData()?.dni) {
          console.log('mesa enlazada correctamente ');
          //mostrar algun mensaje de exito
          this.router.navigate(['/menu-clientes']);
        }else{
          //mostrar algun mensaje de error
          console.log('mesa ocupada por otro cliente');
          return;
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  verEncuestas() {
    this.router.navigate(['/ver-encuesta'])
  }
  hacerEncuesta() {
    this.router.navigate(['/encuesta']);
  }

}
