import { inject, Injectable } from '@angular/core';
import { DbService } from './db-service';
import { IOrder } from '../interfaces/IOrder';
import { IProductOrderToLoad } from '../interfaces/IProductOrder';

@Injectable({
  providedIn: 'root',
})
export class ProductsOrdersService {
  dbService = inject(DbService);

  async loadProductsOrders(order: IOrder) {
    const productOrder: IProductOrderToLoad = {
      p_id_pedido: order.id,
      p_productos: order.data.map((p) => ({
        id_producto: p.id_producto,
        cantidad: p.cantidad,
        precio: p.precio,
      })),
      p_estado: 'pendiente',
    };
    const response = await this.dbService.insertProductsOrders(productOrder);
    console.log('insertando en la tabla productos_pedidos');
    return response;
  }
}
