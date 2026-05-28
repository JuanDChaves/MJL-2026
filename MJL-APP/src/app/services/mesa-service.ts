import { inject, Injectable } from '@angular/core';
import { DbService } from './db-service';
import { IMesa } from '../interfaces/IMesa';
import { QrService } from './qr-service';
import { PhotoService } from './photo-service';
import { IDatosMesaParaQr } from '../interfaces/IDatosMesaParaQr';
import { IResult } from '../interfaces/IResult';
import { IUser } from '../interfaces/IUser';
import { IMesaCliente } from '../interfaces/IMesaCliente';
import { IMesaACargar } from '../interfaces/IMesaACargar';

@Injectable({
  providedIn: 'root',
})
export class MesaService {
  private dbService = inject(DbService);
  private qrService = inject(QrService);
  private photoService = inject(PhotoService);

  async cargarMesa(mesa: IMesaACargar): Promise<IResult<any>> {
    try {
      const existeMesa = await this.existeMesa(mesa.numero_mesa);
      if (existeMesa.data?.length !== 0) {
        return {
          success: false,
          error: { message: 'Ya existe una mesa con ese número' },
          data: null,
        };
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
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: { message: 'Error al cargar la mesa' },
        data: null,
      };
    }
  }

  private async generarUrlPublicaQr(
    datosMesa: IDatosMesaParaQr,
  ): Promise<string> {
    return await this.qrService.generateUrlPublicQr(datosMesa);
  }

  private async subirFotoMesa(mesa: IMesaACargar): Promise<string> {
    const blob = await this.photoService.getPhotoBlob(mesa.url_foto_mesa);
    return await this.photoService.uploadTablePhoto(
      blob,
      `mesa_numero_${mesa.numero_mesa}`,
    );
  }

  async existeMesa(
    numero_mesa: number,
  ): Promise<{ data: any[] | null; error: any }> {
    return await this.dbService.getAllWithFilter(
      'mesas',
      'numero_mesa',
      numero_mesa,
    );
  }

  async mesasDisponibles(): Promise<IResult<IMesa[]>> {
    return await this.mesasSegunDisponibilidad(false);
  }

  async mesasOcupadas(): Promise<IResult<IMesa[]>> {
    return await this.mesasSegunDisponibilidad(true);
  }

  private async mesasSegunDisponibilidad(
    ocupada: boolean,
  ): Promise<IResult<IMesa[]>> {
    try {
      const { data, error } = await this.dbService.getAllWithFilter(
        'mesas',
        'ocupada',
        ocupada,
      );
      if (error) throw error;
      return { success: true, error: null, data: data as IMesa[] };
    } catch (error) {
      return {
        success: false,
        error: {
          message: `Error al obtener mesas ${ocupada ? 'ocupadas' : 'disponibles'}`,
        },
        data: null,
      };
    }
  }

  async asignarMesa(
    cliente: IUser,
    mesaElegida: IMesa,
    id_lista_espera: string,
  ): Promise<IResult<any>> {
    try {
      const { data: mesa, error: mesaError } = await this.dbService.getOneById(
        'mesas',
        mesaElegida.id,
      );

      if (mesaError || !mesa)
        throw mesaError || new Error('Mesa no encontrada');

      const { error: updateMesaError } = await this.dbService.update(
        'mesas',
        'id',
        mesa.id,
        { ocupada: true, user_id: cliente.id },
      );

      if (updateMesaError) throw updateMesaError;

      const { data: listaEspera, error: updateListaError } =
        await this.dbService.update('lista_espera', 'id', id_lista_espera, {
          mesa_id: mesaElegida.id,
          en_espera: false,
        });
      console.log(updateListaError);

      if (updateListaError) throw updateListaError;

      return {
        success: true,
        error: null,
        data: { mesa, cliente: cliente.id },
      };
    } catch (error) {
      return {
        success: false,
        error: { message: 'Error al asignar la mesa' },
        data: null,
      };
    }
  }

  async chequearMesaAsignada(numeroMesa: number) {
    const result: IResult<IMesaCliente> = {
      success: false,
      error: null,
      data: null,
    };
    try {
      const { data: mesaList, error: mesaError } =
        await this.dbService.MesaConCliente(numeroMesa);

      if (mesaError || !mesaList || mesaList.length === 0) {
        result.error = { message: 'Mesa no encontrada' };
        return result;
      }
      const mesa_con_usuario: IMesaCliente = {
        id: mesaList[0].id,
        numero_mesa: mesaList[0].numero_mesa,
        ocupada: mesaList[0].ocupada,
        cliente: mesaList[0].cliente,
        cantidad_comensales: mesaList[0].cantidad_comensales,
        url_foto_mesa: mesaList[0].url_foto_mesa,
        url_qr: mesaList[0].url_qr,
      };

      result.success = true;
      result.data = mesa_con_usuario;
      return result;
    } catch (error) {
      return {
        success: false,
        error: { message: 'Error al enlazarse con la mesa' },
        data: null,
      };
    }
  }

  async liberarMesa(numer_mesa: number) {
    const result = await this.dbService.update(
      'mesas',
      'numer_mesa',
      numer_mesa,
      { ocupada: false, dni: null },
    );
    return result;
  }

  async getByIdUser(id_user: string): Promise<IResult<IMesa>> {
    const result = await this.dbService.getAllWithFilter(
      'mesas',
      'user_id',
      id_user,
    );
    if (result.error || !result.data || result.data.length === 0)
      return {
        success: false,
        error: { message: 'Mesa no encontrada' },
        data: null,
      };
    return { success: true, error: null, data: result.data[0] };
  }

  async getById(id_mesa: string):Promise<IResult<IMesa>>{
    const result = await this.dbService.getOneById('mesas', id_mesa);
    if (result.error || !result.data || result.data.length === 0)
      return {
        success: false,
        error: { message: 'Mesa no encontrada' },
        data: null,
      };
    return { success: true, error: null, data: result.data as IMesa };
  }
}
