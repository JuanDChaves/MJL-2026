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

  async insertWaitingList(user: IUser): Promise<IResult<any>> {
    const result: IResult<any> = {
      success: false,
      error: null,
      data: null,
    };

    const response = await this.dbService.insert('lista_espera', {
      user_id: user.id,
      en_espera: true,
    });
    console.log(response);
    if (response.error) {
      result.success = false;
      if (response.error.code === '23505') {
        result.error = { message: 'Ya estas en la lista de espera' };
        return result;
      }
    }
    result.data = response.data;
    result.success = true;
    return result;
  }

  async waitingCustomerList(): Promise<IResult<ClienteEnEspera[]>> {
    const response = await this.dbService.waitingCustomer();
    const result: IResult<ClienteEnEspera[]> = {
      success: false,
      error: null,
      data: null,
    };
    if (response.success) {
      result.success = true;
      result.data = response.data as ClienteEnEspera[] ?? null;
    } else {
      result.error = response.error;
    }
    return result;
  }

  async clientById(id: string): Promise<IResult<IUser>> {
    const response = await this.dbService.getOneById('usuarios', id);
    const result: IResult<IUser> = {
      success: false,
      error: null,
      data: null,
    }
    if (response.error) {
      result.error = { message: 'Error al obtener el usuario' }
      return result;
    }
    result.success = true;
    result.data = response.data as IUser ?? null;
    return result;
  }

}
