import { Component, inject } from '@angular/core';
import { IonContent, IonButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { qrCodeOutline, personCircleOutline } from 'ionicons/icons';
import { BarcodeScannerService } from '../../../services/barcode-scanner-service';
import { UserService } from '../../../services/user-service';
import { Router } from '@angular/router';

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

  constructor() {
    addIcons({ qrCodeOutline, personCircleOutline });
  }

  async scanQr() {
    const response = await this.scannerService.scanQrGeneric();
    console.log(response);

    if (response) {
      // 1. Generamos el token único para esta nueva visita
      const nuevaEstadia = crypto.randomUUID();
      
      // 2. Lo guardamos en el almacenamiento del celular
      localStorage.setItem('id_estadia', nuevaEstadia);
      console.log('Estadía iniciada desde la puerta:', nuevaEstadia);

      // 3. Continuamos con la navegación dinámica que ya tenías
      this.router.navigate([`/${response}`]);
    }
  }
}
