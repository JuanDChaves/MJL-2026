import { inject, Injectable } from '@angular/core';
import { DbService } from './db-service';
import { IOrderToLoad } from '../interfaces/IOrderToLoad';
import { IResult } from '../interfaces/IResult';
import { IOrder } from '../interfaces/IOrder';
import { TypeOrderState } from '../types/TypeOrderState';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  dbService = inject(DbService);
  
  
  async getOrdersWithStateFilter(stateOrder: TypeOrderState): Promise<IResult<IOrder[]>> {
    const response = await this.dbService.getAllWithFilter(
      'pedidos',
      'estado',
      stateOrder,
    );
    const result: IResult<IOrder[]> = {
      success: false,
      error: null,
      data: null,
    };
    if (response.error) {
      result.success = false;
      result.error = { message: 'Error al obtener los pedidos' };
    }
    result.data = (response.data as IOrder[]) ?? [];
    result.success = true;
    return result;
  }

  async getOneOrder(id: string): Promise<IResult<IOrder>> {
    const response = await this.dbService.getOneById('pedidos', id);
    const result: IResult<IOrder> = {
      success: false,
      error: null,
      data: null,
    };
    if (response.error) {
      result.error = { message: 'Error al obtener el pedido' };
      return result;
    }
    result.success = true;
    result.data = response.data as IOrder ?? null;
    return result;
  }

  async insertOrder(order: IOrderToLoad): Promise<IResult<IOrder>> {
    const result: IResult<any> = {
      success: false,
      error: null,
      data: null,
    };
    const response = await this.dbService.insert('pedidos', {
      id_cliente: order.id_cliente,
      nombre_cliente: order.nombre_cliente,
      estado: order.estado,
      numero_mesa: order.numero_mesa,
      data: order.data,
    });
    console.log(response, 'insertOrder');
    if (response.error) {
      result.success = false;
      result.error = { message: 'Error al crear el pedido' };
      return result;
    }
    const orderResult: IOrder = response.data as IOrder;
    result.data = orderResult;
    result.success = true;
    return result;
  }

  async rejectOrder(id_pedido: string) {
    return await this.updateOrderState(id_pedido, TypeOrderState.Editando);    
  }
  async approveOrder(id_pedido: string) {
        return await this.updateOrderState(id_pedido, TypeOrderState.Preparando);    
  }
  async finishOrder(id_pedido: string) {
    return await this.updateOrderState(id_pedido, TypeOrderState.Hecho);
  }

  async deliverOrder(id_pedido: string) {
    return await this.updateOrderState(id_pedido, TypeOrderState.Entregando);    
  }
  async receivedOrder(id_pedido: string) {
    return await this.updateOrderState(id_pedido, TypeOrderState.Recibido);
  }

  async payOrder(id_pedido: string) {
    return await this.updateOrderState(id_pedido, TypeOrderState.Pagado);
  }
  async confirmedPayment(id_pedido: string) {
    return await this.updateOrderState(id_pedido, TypeOrderState.Finalizado);    
  }


  private async updateOrderState(id_pedido: string, estadoNuevo: TypeOrderState) {
    const result : IResult<IOrder> = {
      success: false,
      error: null,
      data: null
    }
    const response = await this.dbService.update('pedidos', 'id', id_pedido, {
      estado: estadoNuevo,
    });
    if (response.error) {
      result.error = { message: `No se pudo cargar en el pedido el estado: "${estadoNuevo}"` };
      return result;
    }
    const orderResult: IOrder = response.data as IOrder;
    result.data = orderResult;
    result.success = true;
    return result;
  }
}
