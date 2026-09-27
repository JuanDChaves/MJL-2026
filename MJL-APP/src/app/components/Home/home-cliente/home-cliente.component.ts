import { Component, inject } from '@angular/core';
import { IonContent, IonButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { qrCodeOutline, personCircleOutline } from 'ionicons/icons';
import { BarcodeScannerService } from '../../../services/barcode-scanner-service';
import { UserService } from '../../../services/user-service';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/services/toast-service';

@Component({
  selector: 'app-home-cliente',
  templateUrl: './home-cliente.component.html',
  styleUrls: ['./home-cliente.component.scss'],
  imports: [IonContent, IonButton, IonIcon],
})
export class HomeClienteComponent {
  private scannerService = inject(BarcodeScannerService);
  userService = inject(UserService);
  router = inject(Router);
  toastService = inject(ToastService);
  constructor() {
    addIcons({ qrCodeOutline, personCircleOutline });
  }

  async scanQr() {
    const response = await this.scannerService.scanQrGeneric();
    console.log(response);

    if (response === 'ingreso-local-cliente') {
      const nuevaEstadia = crypto.randomUUID();
      localStorage.setItem('id_estadia', nuevaEstadia);
      console.log('Estadía iniciada desde la puerta:', nuevaEstadia);
      this.router.navigate([`/${response}`]);
    }else{
      await this.toastService.showError('QR no reconocido');
    }
  }
}
