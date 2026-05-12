import { inject, Injectable } from '@angular/core';
import { PhotoService } from './photo-service';
import { environment } from 'src/environments/environment.prod';
import { IDatosMesaParaQr } from '../interfaces/IDatosMesaParaQr';

@Injectable({
  providedIn: 'root',
})
export class QrService {
  photoService = inject(PhotoService);
  apiUrl = environment.apiQr;
  

  async generateUrlPublicQr(data:IDatosMesaParaQr){
    const toString = JSON.stringify(data);
    const url = `${this.apiUrl+toString}`;
    const blob = await this.photoService.getPhotoBlob(url);
    return await this.photoService.uploadQrCode(blob,data.numero_mesa.toString());
  }

}
