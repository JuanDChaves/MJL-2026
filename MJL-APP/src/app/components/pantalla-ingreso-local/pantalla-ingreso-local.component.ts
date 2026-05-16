import { Component, inject } from '@angular/core';
import { IonButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { qrCodeOutline, enterOutline, clipboardOutline } from 'ionicons/icons';
import { LayoutComponent } from '../layout/layout.component';
import { BarcodeScannerService } from '../../services/barcode-scanner-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pantalla-ingreso-local',
  templateUrl: './pantalla-ingreso-local.component.html',
  styleUrls: ['./pantalla-ingreso-local.component.scss'],
  imports: [IonButton, IonIcon, LayoutComponent],
})
export class PantallaIngresoLocalComponent {
  private scannerService = inject(BarcodeScannerService);
  router = inject(Router);

  constructor() {
    addIcons({ qrCodeOutline, enterOutline, clipboardOutline });
  }

  anunciarse() {
    // TODO: ingresar a lista de espera
  }

  async escanearQR() {
    // await this.scannerService.scanQrGeneric();
    this.router.navigate(['/menu-clientes']);
  }

  verEncuestas() {
  }
}