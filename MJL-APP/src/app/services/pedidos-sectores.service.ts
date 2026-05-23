import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase-service';

@Injectable({
  providedIn: 'root'
})
export class PedidosSectoresService {

  constructor(private db: SupabaseService) { }

  async obtenerPedidosPorSector(rol: string) {
    // Obtenemos los pedidos con sus relaciones
    const { data: pedidos, error } = await this.db.client
      .from('pedidos')
      .select(`
        *,
        productos_pedido (
          id,
          cantidad,
          estado,
          productos (*)
        )
      `);

    if (error || !pedidos) return [];

    const rolSeguro = rol ? String(rol).toLowerCase() : '';

    const pedidosFiltrados = pedidos.map(pedido => {
      const relacionProductos = pedido.productos_pedido || [];
      
      // Filtramos los productos que pertenecen al empleado (Cocinero = plato / Cantinero = bebida)
      const productosDelSector = relacionProductos.filter((intermedia: any) => {
        const detallesProducto = intermedia.productos || {};
        const tipo = detallesProducto.tipo ? String(detallesProducto.tipo).toLowerCase() : '';
        return (rolSeguro === 'cocinero' && tipo === 'plato') || 
              (rolSeguro === 'cantinero' && tipo === 'bebida');
      });

      // Si no tiene productos de este sector, lo omitimos
      if (productosDelSector.length === 0) return null;

      // Aplanamos la información para la vista
      const productosPlanos = productosDelSector.map((intermedia: any) => ({
        id_producto_pedido: intermedia.id,
        cantidad: intermedia.cantidad,
        estado: intermedia.estado,
        ...intermedia.productos
      }));

      // Si hay al menos un producto en 'preparando', el estado del pedido para ESTE sector es 'preparando'
      const tienePreparando = productosPlanos.some((p: any) => p.estado === 'preparando');
      const sectorEstado = tienePreparando ? 'preparando' : 'hecho';

      return {
        ...pedido,
        fecha: pedido.created_at,
        mesa: pedido.numero_mesa,
        productos: productosPlanos,
        estadoSector: sectorEstado
      };
      
    }).filter(p => p !== null);

    return pedidosFiltrados;
  }

  async cambiarEstadoProductosPorSector(pedido: any, nuevoEstado: string) {
    // Obtenemos los IDs de la tabla "productos_pedido" que pertenecen a nuestro sector
    const ids = pedido.productos.map((p: any) => p.id_producto_pedido);
    
    if (ids.length === 0) return false;

    // Actualizamos SOLO esos registros
    const { error } = await this.db.client
      .from('productos_pedido')
      .update({ estado: nuevoEstado })
      .in('id', ids);

    if (error) {
      console.error('Error al actualizar estado', error);
      return false;
    }
    return true;
  }
}