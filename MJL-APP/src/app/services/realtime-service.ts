import { inject, Injectable } from '@angular/core';
import { SupabaseService } from './supabase-service';
import { DbService } from './db-service';
import { IResult } from '../interfaces/IResult';
import { IMensajeChat } from '../interfaces/IMensajeChat';
import { IMensajeChatEnviado } from '../interfaces/IMensajeChatEnviado';

@Injectable({
  providedIn: 'root',
})
export class RealtimeService {
  private sbService = inject(SupabaseService);
  public canal = this.sbService.client.channel('table-db-changes');
  private dbService = inject(DbService);
  async getAllMsgClient (mesa_id:string){
    const result :IResult<IMensajeChat[]> = {success: false, error: null, data: null};  
    const { data, error } = await this.sbService.client
                              .from('chat')
                              .select('*')
                              .eq('mesa_id', mesa_id);

    if(error){
      console.log(error);
      result.error = {message: 'Error al obtener los mensajes'};
      return result;
    }

    result.success = true;
    result.data = data as IMensajeChat[];
    return result;
  }

  async sendMsg(msg :IMensajeChatEnviado): Promise<IResult<IMensajeChat>>{
    const result :IResult<IMensajeChat> = {success: false, error: null, data: null};

    const { data, error } = await this.dbService.insert('chat', msg);
    if(error){
      console.log(error);
      result.error = {message: 'Error al enviar el mensaje'};
      return result;
    }

    result.success = true;
    result.data = data as IMensajeChat

    return result;
  }

}
