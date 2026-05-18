import { inject, Injectable } from '@angular/core';
import { DbService } from './db-service';
import { SupabaseService } from './supabase-service';
import { IMesa } from '../interfaces/IMesa';
import { QrService } from './qr-service';
import { PhotoService } from './photo-service';
import { IDatosMesaParaQr } from '../interfaces/IDatosMesaParaQr';
import { IResult } from '../interfaces/IResult';
import { IUser } from '../interfaces/IUser';
import { IMesaDniCliente } from '../interfaces/IMesaDniCliente';

@Injectable({
  providedIn: 'root',
})
export class MesaService {
  private dbService = inject(DbService);
  private supabaseService = inject(SupabaseService);
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

  async getAvailableMesas(): Promise<IResult<IMesa[]>> {
    try {
      const { data, error } = await this.supabaseService.client
        .from('mesas')
        .select('*')
        .eq('ocupada', false);
      if (error) throw error;
      return { success: true, error: null, data: data as IMesa[] };
    } catch (error) {
      return { success: false, error: { message: 'Error al obtener mesas disponibles' }, data: null };
    }
  }

  async asignarMesa(cliente: IUser, numeroMesa: number): Promise<IResult<any>> {
    try {
      const { data: mesa, error: mesaError } = await this.supabaseService.client
        .from('mesas')
        .select('id, numero_mesa')
        .eq('numero_mesa', numeroMesa)
        .single();

      if (mesaError || !mesa) throw mesaError || new Error('Mesa no encontrada');

      const { error: updateMesaError } = await this.supabaseService.client
        .from('mesas')
        .update({ ocupada: true, dni: cliente.dni })
        .eq('id', mesa.id);

      if (updateMesaError) throw updateMesaError;

      const { error: updateListaError } = await this.supabaseService.client
        .from('lista_espera')
        .update({ mesa_id: mesa.id, en_espera: false })
        .eq('user_id', cliente.id);

      if (updateListaError) throw updateListaError;

      return { success: true, error: null, data: { mesa, cliente: cliente.id } };
    } catch (error) {
      return { success: false, error: { message: 'Error al asignar la mesa' }, data: null };
    }
  }

  async chequearMesaAsignada(numeroMesa:number){
    const result :IResult<IMesaDniCliente> = {
      success: false,
      error: null,
      data: null
    }
    try {
      const {data:mesaList, error: mesaError} = await this.dbService.getAllWithFilter('mesas','numero_mesa',numeroMesa);

      if(mesaError || !mesaList || mesaList.length === 0) {
        result.error = {message: 'Mesa no encontrada'};
        return result;
      }
      const mesa_con_usuario :IMesaDniCliente = {
        id: mesaList[0].id,
        numero_mesa: mesaList[0].numero_mesa,
        ocupada: mesaList[0].ocupada,
        dni: mesaList[0].dni,
      }

      result.success = true;
      result.data = mesa_con_usuario;
      return result;
      
    } catch (error) {
      return {
        success: false,
        error: { message: 'Error al enlazarse con la mesa' },
        data: null
      }
    }
  }

  async liberarMesa(numer_mesa:number){
    const result = await this.dbService.update('mesas', 'numer_mesa', numer_mesa, {ocupada: false, dni: null});
    return result
  }

}
