import { inject, Injectable } from '@angular/core';
import { DbService } from './db-service';
import { IOrderToLoad } from '../interfaces/IOrderToLoad';
import { IResult } from '../interfaces/IResult';
import { IOrder } from '../interfaces/IOrder';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  dbService = inject(DbService);

  async getAllOrders() {
    const response = await this.dbService.getAllWithFilter('pedidos', 'estado', 'pendiente');
    return response.data ?? [];
  }

  async getOneOrder(id: string) {
    const response = await this.dbService.getOneById('pedidos', id);
    return response.data ?? null;
  }

  async insertOrder(order: IOrderToLoad): Promise<IResult<IOrder>> {
    const result:IResult<any> = {
      success: false,
      error: null,
      data: null
    }
    const response = await this.dbService.insert('pedidos', {
      id_cliente: order.id_cliente,
      nombre_cliente: order.nombre_cliente,
      estado: order.estado,
      numero_mesa: order.numero_mesa,
      data:order.data,
    });
    console.log(response,'insertOrder');
    if (response.error) {
      result.success = false;
      result.error = {message: 'Error al crear el pedido'};
      return result;
    }
    const orderResult : IOrder = response.data as IOrder; 
    result.data = orderResult;
    result.success = true;
    return result;
    
  }
  
}
