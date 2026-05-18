import { inject, Injectable } from '@angular/core';
import { DbService } from './db-service';
import { IUser } from '../interfaces/IUser';
import { IResult } from '../interfaces/IResult';

@Injectable({
  providedIn: 'root',
})
export class ClientService {

  private dbService = inject(DbService);

  async loadWaitingList(user:IUser):Promise<IResult<any>>{
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
  
}
