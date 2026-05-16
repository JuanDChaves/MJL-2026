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
    this.router.navigate([`/${response}`]);
    
  }
}
