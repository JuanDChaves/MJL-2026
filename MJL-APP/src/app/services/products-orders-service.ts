import { inject, Injectable } from '@angular/core';
import { DbService } from './db-service';
import { IOrder } from '../interfaces/IOrder';
import { IProductOrderToLoad } from '../interfaces/IProductOrderToLoad';
import { TypeOrderState } from '../types/TypeOrderState';
import { IPedidoEnPreparacion } from '../interfaces/IPedidoEnPreparacion';
import { IResult } from '../interfaces/IResult';
import { TypeProduct } from '../types/TypeProduct';

@Injectable({
  providedIn: 'root',
})
export class ProductsOrdersService {
  private dbService = inject(DbService);

  //Inserta los productos de un pedido
  async insertProductsOrders(order: IOrder) {
    const productOrder: IProductOrderToLoad = {
      p_id_pedido: order.id,
      p_productos: order.data.map((p) => ({
        id_producto: p.id_producto,
        cantidad: p.cantidad,
        precio: p.precio,
      })),
      p_estado: TypeOrderState.Preparando,
    };
    const response = await this.dbService.insertProductsOrders(productOrder);
    console.log('insertando en la tabla productos_pedidos');
    return response;
  }

  //Obtenes todos los productos de un pedido
  getProductsOrdersByIdOrder(id_order: string) {
    const response = this.dbService.getAllWithFilter(
      'productos_pedidos',
      'id_pedido',
      id_order,
    );
    return response;
  }

  async getProductsCocina() {
    const result: IResult<IPedidoEnPreparacion[]> = {
      data: null,
      error: null,
      success: false,
    };
    const { data, error } = await this.dbService.getProductsCocina();
    if (error) {
      result.error = { message: 'Error al obtener los productos de la cocina' };
    }
    result.success = true;
    result.data = data as IPedidoEnPreparacion[];
    return result;
  }

  async getProductsBarra() {
    const result: IResult<IPedidoEnPreparacion[]> = {
      data: null,
      error: null,
      success: false,
    };
    const { data, error } = await this.dbService.getProductsBarra();
    if (error) {
      result.error = { message: 'Error al obtener los productos de la barra' };
    }
    result.success = true;
    result.data = data as IPedidoEnPreparacion[];
    return result;
  }

  async finishProducts(p_id_pedido: string, p_tipo: string) {
    const result: IResult<IPedidoEnPreparacion[]> = {
      data: null,
      error: null,
      success: false,
    };
    const { data, error } = await this.dbService.finishProducts(
      p_id_pedido,
      p_tipo,
    );
    if (error) {
      console.log(error);
      result.error = { message: 'Error al obtener los productos de la barra' };
    }
    result.success = true;
    result.data = data as any;
    return result;
  }

  async isOrderCompleted(id_pedido: string) {
    const result: IResult<void> = {
      data: null,
      error: null,
      success: false,
    };
    const response = await this.dbService.isOrderCompleted(id_pedido);
    console.log(response);
    if (response.error) {
      result.error = {
        message: 'Error al verificar si el pedido esta completado',
      };
      return result;
    } else if (response.data.length !== 0) {
      return result;
    }
    result.success = true;
    return result;
  }
}
