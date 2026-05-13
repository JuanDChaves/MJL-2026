import { inject, Injectable } from '@angular/core';
import { PhotoService } from './photo-service';
import QRCode from 'qrcode';

@Injectable({
  providedIn: 'root',
})
export class QrService {
  photoService = inject(PhotoService);

  async generateUrlPublicQr(data: any) {
    const jsonString = JSON.stringify(data);
    const dataUrl = await QRCode.toDataURL(jsonString, {
      width: 300,
      margin: 2,
      color: {
        dark: '#1A1A1AFF',
        light: '#F3E9DAFF',
      },
    });
    const blob = await (await fetch(dataUrl)).blob();
    return await this.photoService.uploadQrCode(blob, data.numero_mesa.toString());
  }
}
