import { inject, Injectable } from '@angular/core';
import { DbService } from './db-service';
import { IPedido } from '../interfaces/IPedido';
import { cogSharp } from 'ionicons/icons';
import { IPedidoConProductos } from '../interfaces/IProductoPedido';

@Injectable({
  providedIn: 'root',
})
export class PedidosService {
  dbService = inject(DbService);

  async getPedidoPorId(id: string): Promise<{ data: any | null; error: any}> {
    const response = await this.dbService.getOneById('pedidos', id)
    if(response.error) {
      console.log(response.error);
      return { data: null, error: response.error }
    }
    return { data: response.data, error: null};
  }

  async getPedidos(): Promise<{ data: any | null; error: any }> {
  const response = await this.dbService.getAll('pedidos');
  if (response.error) {
    console.log(response.error);
    return { data: null, error: response.error };
  }
  return { data: response.data, error: null };
  }

  async cargarPedidos(): Promise<IPedido[]> {
  const response = await this.getPedidos();
    if (response.error) {
      return [];
    }
    console.log(response.data);
    return response.data as IPedido[];
  }

  async cargarPedidoPorId(id: string): Promise<IPedido> {
    const response = await this.getPedidoPorId(id);
    console.log(response.data)
    return response.data as IPedido;
  }

  async getPedidoConProductos(id: string): Promise<{ data: any | null; error: any}> {
    const selectQuery= `
      *,
      productos_pedido (
        id, 
        cantidad,
        precio, 
        estado,
        pedidos (
          id, 
          nombre,
          descripcion,
          tiempo_elaboracion,
          precio,
          tipo,
          fotos
        )
      )
    `;

    const response = await this.dbService.getOneByIdWithRelations("pedidos", id, selectQuery) 
    
    if(response.error) {
      console.log(response.error);
      return { data: null, error: response.error };
    }
    return { data: response.data, error: null };
  } 

  async cargarPedidoConProductos(id: string): Promise<IPedidoConProductos | null> {
    const response = await this.getPedidoConProductos(id);
    console.log(response.data)
    return response.data as IPedidoConProductos | null; 
  }
}
