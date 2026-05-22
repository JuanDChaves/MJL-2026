import { inject, Injectable } from '@angular/core';
import { DbService } from './db-service';
import { IUser } from '../interfaces/IUser';
import { IResult } from '../interfaces/IResult';
import { ClienteEnEspera } from '../interfaces/ClienteEnEspera';

@Injectable({
  providedIn: 'root',
})
export class ClientService {

  private dbService = inject(DbService);

  async insertWaitingList(user:IUser):Promise<IResult<any>>{
    const result:IResult<any> ={
      success: false,
      error: null,
      data: null
    }
    
    const response = await this.dbService.insert('lista_espera',{
      user_id: user.id,
      en_espera: true,
    })
    console.log(response);
    if(response.error){
      result.success = false
      if(response.error.code === "23505"){
        result.error = {message: "Ya estas en la lista de espera"};
        return result;
      }
    }
    result.data = response.data
    result.success = true
    return result
  }

  async waitingCustomerList():Promise<IResult<ClienteEnEspera[]>> {
      const response = await this.dbService.waitingCustomer();
      const result : IResult<ClienteEnEspera[]> ={
        success: false,
        error: null,
        data: null
      }
      if(response.success){
        const clientesEsperando: ClienteEnEspera[] = [];
        response.data!.map((clienteEsperando) =>{
          let cliente = clienteEsperando.cliente as IUser;
          let clientWaiting: ClienteEnEspera = {
            en_espera: clienteEsperando.en_espera,
            id: clienteEsperando.id,
            mesa_id: clienteEsperando.mesa_id,
            cliente: cliente,
          }
          clientesEsperando.push(clientWaiting);
        }
      );
        result.success = true;
        result.data = response.data;
      }else{
        result.error = response.error;
      }
      return result;
    }
  
}
