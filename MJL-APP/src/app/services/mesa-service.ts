import { inject, Injectable } from '@angular/core';
import { DbService } from './db-service';
import { IMesa } from '../interfaces/IMesa';
import { QrService } from './qr-service';
import { PhotoService } from './photo-service';
import { IDatosMesaParaQr } from '../interfaces/IDatosMesaParaQr';
import { IResult } from '../interfaces/IResult';

@Injectable({
  providedIn: 'root',
})
export class MesaService {
  private dbService = inject(DbService);
  private qrService = inject(QrService);
  private photoService = inject(PhotoService);

  async cargarMesa(mesa: IMesa): Promise<IResult<any>> {
    try {
    const existeMesa = await this.existeMesa(mesa.numero_mesa);
    if (existeMesa.data?.length !== 0) {
      return{
        success: false,
        error: { message: 'Ya existe una mesa con ese número' },
        data: null
      }
    }
    const urlPhoto = await this.subirFotoMesa(mesa);
    mesa.url_foto_mesa = urlPhoto;

    const urlPublicQr = await this.generarUrlPublicaQr({
      numero_mesa: mesa.numero_mesa,
      tipo_mesa: mesa.tipo_mesa,
      cantidad_comensales: mesa.cantidad_comensales,
      url_foto_mesa: mesa.url_foto_mesa,
    });
    mesa.url_qr = urlPublicQr;

    const response = await this.dbService.insert('mesas', mesa);
    return {
      success: true,
      error: null,
      data: response.data
    };
    } catch (error) {
      return {
        success: false,
        error: { message: 'Error al cargar la mesa' },
        data: null
      }
    }
  }

  private async generarUrlPublicaQr(datosMesa: IDatosMesaParaQr):Promise<string> {
    return await this.qrService.generateUrlPublicQr(datosMesa);
  }

  private async subirFotoMesa(mesa: IMesa):Promise<string> {
    const blob = await this.photoService.getPhotoBlob(mesa.url_foto_mesa);
    return await this.photoService.uploadTablePhoto(
      blob,
      `mesa_numero_${mesa.numero_mesa}`
    );
  }

  async existeMesa(numero_mesa: number):Promise<{ data: any[] | null; error: any }> {
    return await this.dbService.getAllWithFilter('mesas','numero_mesa',numero_mesa);
  }
}
