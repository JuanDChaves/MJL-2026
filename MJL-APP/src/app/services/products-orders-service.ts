import { inject, Injectable } from '@angular/core';
import { DbService } from './db-service';
import { IOrder } from '../interfaces/IOrder';
import { IProductOrderToLoad } from '../interfaces/IProductOrderToLoad';

@Injectable({
  providedIn: 'root',
})
export class ProductsOrdersService {
  dbService = inject(DbService);

  //Inserta los productos de un pedido
  async insertProductsOrders(order: IOrder) {
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

  //Obtenes todos los productos de un pedido
  getProductsOrdersByIdOrder(id_order: string) {
    const response = this.dbService.getAllWithFilter('productos_pedidos', 'id_pedido', id_order);
    return response;
  }
}
