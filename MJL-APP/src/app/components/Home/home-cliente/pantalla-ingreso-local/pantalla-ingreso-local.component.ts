import { Component, inject } from '@angular/core';
import { IonButton, IonIcon, ViewWillEnter } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { qrCodeOutline, enterOutline, clipboardOutline, documentTextOutline } from 'ionicons/icons';
import { LayoutComponent } from '../../../layout/layout.component';
import { BarcodeScannerService } from '../../../../services/barcode-scanner-service';
import { Router } from '@angular/router';
import { ClientService } from 'src/app/services/client-service';
import { UserService } from 'src/app/services/user-service';

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
        return;
      }
      console.log(response.error);
      return;

    }
  }

  async escanearQR() {
    // await this.scannerService.scanQrGeneric();
    this.router.navigate(['/menu-clientes']);
  }

  verEncuestas() {
    this.router.navigate(['/ver-encuesta'])
  }
  hacerEncuesta() {
    this.router.navigate(['/encuesta']);
  }

}
