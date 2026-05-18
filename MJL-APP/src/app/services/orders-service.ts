import { inject, Injectable } from '@angular/core';
import { DbService } from './db-service';
import { IUser } from '../interfaces/IUser';
import { ClienteEnEspera } from '../interfaces/ClienteEnEspera';
import { IResult } from '../interfaces/IResult';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  dbService = inject(DbService)

  async waitingCustomer():Promise<IResult<ClienteEnEspera[]>> {
    const response = await this.dbService.waitingCustomer();
    const result : IResult<ClienteEnEspera[]> ={
      success: false,
      error: null,
      data: null
    }
    if(response.success){
      const orders: ClienteEnEspera[] = [];
      response.data!.map((order) =>{
        let cliente = order.cliente as IUser;
        let toOrder: ClienteEnEspera = {
          en_espera: order.en_espera,
          id: order.id,
          mesa_id: order.mesa_id,
          cliente: cliente,
        }
        orders.push(toOrder);
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
