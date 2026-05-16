import { inject, Injectable } from '@angular/core';
import { DbService } from './db-service';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {

  dbService = inject(DbService)

  getAllProducts() {
    return this.dbService.getAll('productos');
  }

  async getDrinks() {
    const response =  await this.dbService.getAllWithFilter('productos','tipo','bebida');
    return response.data ?? [];
  }

  async getFood() {
    const response = await this.dbService.getAllWithFilter('productos','tipo','plato');
    return response.data ?? [];
  }

  
}
