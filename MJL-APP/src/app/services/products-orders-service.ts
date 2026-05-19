import { inject, Injectable } from '@angular/core';
import { DbService } from './db-service';
import { IProductOrderToLoad } from '../interfaces/IProductOrder';

@Injectable({
  providedIn: 'root',
})
export class ProductsOrdersService {

  dbService = inject(DbService)

  async loadProductsOrders(data:IProductOrderToLoad) {
    const response = await this.dbService.insertProductsOrders(data);
    console.log('insertando en la tabla productos_pedidos');
    return response
  }
  
}
