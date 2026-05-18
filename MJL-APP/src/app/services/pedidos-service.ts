import { inject, Injectable } from '@angular/core';
import { DbService } from './db-service';

@Injectable({
  providedIn: 'root',
})
export class PedidosService {
  dbService = inject(DbService)

  async waitingCustomer(){
    // const response = this.dbService.
  }


}
