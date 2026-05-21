import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase-service'; // Ajusta la ruta a tu servicio principal

@Injectable({
  providedIn: 'root'
})
export class PedidosSectoresService {

  constructor(private db: SupabaseService) { }

  /**
   * Trae los pedidos y filtra los productos según el rol del empleado.
   * @param rol 'cocinero' o 'cantinero'
   */
  async obtenerPedidosPorSector(rol: string) {
    const { data: pedidos, error } = await this.db.client
      .from('pedidos')
      .select(`
        *,
        productos_pedido (
          cantidad,
          productos (*)
        )
      `);

    if (error || !pedidos) return [];

    // Estandarizamos el rol a minúsculas por seguridad
    const rolSeguro = rol ? String(rol).toLowerCase() : '';

    const pedidosFiltrados = pedidos.map(pedido => {
      const relacionProductos = pedido.productos_pedido || [];
      
      const productosPlanos = relacionProductos.map((intermedia: any) => {
        const detallesProducto = intermedia.productos || {}; 
        return {
          cantidad: intermedia.cantidad,
          ...detallesProducto
        };
      });

      const productosDelSector = productosPlanos.filter((prod: any) => {
        const tipo = prod.tipo ? String(prod.tipo).toLowerCase() : '';
        
        // Comparamos usando 'cantinero' exactamente como lo tenés en tu app
        if (rolSeguro === 'cocinero') {
          return tipo === 'plato'; 
        } else if (rolSeguro === 'cantinero') {
          return tipo === 'bebida';
        }
        return false;
      });

      return {
        ...pedido,
        fecha: pedido.created_at, 
        productos: productosDelSector 
      };
      
    }).filter(pedido => pedido.productos && pedido.productos.length > 0);

    return pedidosFiltrados;
  }

  async cambiarEstadoPedido(pedidoId: string, nuevoEstado: string) {
    const { error } = await this.db.client
      .from('pedidos')
      .update({ estado: nuevoEstado })
      .eq('id', pedidoId);
      
    if (error) console.error('Error al actualizar estado', error);
  }
}