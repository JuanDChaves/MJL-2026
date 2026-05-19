import { inject, Injectable } from '@angular/core';
import { SupabaseService } from './supabase-service';
import { IProductOrderToLoad } from '../interfaces/IProductOrder';

export interface BaseEntity {
  id?: string;
  activo: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class DbService<T extends BaseEntity> {
  private sbService = inject(SupabaseService);

  async insert(
    table: string,
    data: Omit<T, 'id'>,
  ): Promise<{ data: T | null; error: any }> {
    const { data: result, error } = await this.sbService.client
      .from(table)
      .insert(data as any)
      .select()
      .single();
    return { data: result, error };
  }

  async update(
    table: string,
    column: string,
    value: any,
    data: Partial<T>,
  ): Promise<{ data: T | null; error: any }> {
    const { data: result, error } = await this.sbService.client
      .from(table)
      .update(data as any)
      .eq(column, value)
      .select()
      .single();
    return { data: result, error };
  }

  async delete(table: string, id: string): Promise<{ error: any }> {
    const { error } = await this.sbService.client
      .from(table)
      .update({ activo: false })
      .eq('id', id);
    return { error };
  }

  async getAllWithFilter(
    table: string,
    filter: string,
    value: any,
  ): Promise<{ data: T[] | null; error: any }> {
    const { data, error } = await this.sbService.client
      .from(table)
      .select('*')
      .eq(filter, value);
    return { data: data as T[] | null, error };
  }

  async getAll(table: string): Promise<{ data: T[] | null; error: any }> {
    const { data, error } = await this.sbService.client.from(table).select('*');
    return { data: data as T[] | null, error };
  }

  async getOneById(
    table: string,
    id: string,
  ): Promise<{ data: T | null; error: any }> {
    const { data, error } = await this.sbService.client
      .from(table)
      .select('*')
      .eq('id', id)
      .single();
    return { data: data as T | null, error };
  }

  async getOneByEmail(
    table: string,
    email: string,
  ): Promise<{ data: T | null; error: any }> {
    const { data, error } = await this.sbService.client
      .from(table)
      .select('*')
      .eq('correo_electronico', email)
      .single();
    return { data: data as T | null, error };
  }

  //aca el id es el dni o cuil del usuario
  async userExist(table: string, dni: string): Promise<boolean> {
    try {
      const responseId = await this.sbService.client
        .from(table)
        .select('*')
        .eq('dni', dni)
        .maybeSingle();
      return responseId.data !== null;
    } catch (error) {
      console.error('Error checking user existence:', error);
      return false;
    }
  }

  // 1. Verifica si ya existe un plato/bebida con ese nombre
  async verificarProductoExistente(
    nombre: string,
    tipo: 'plato' | 'bebida',
  ): Promise<boolean> {
    const { data, error } = await this.sbService.client
      .from('productos')
      .select('nombre')
      .ilike('nombre', nombre) // ilike hace la búsqueda ignorando mayúsculas/minúsculas
      .eq('tipo', tipo)
      .maybeSingle();

    if (error) {
      console.error('Error al verificar producto:', error);
      throw error;
    }

    return data !== null; // Devuelve true si encontró algo
  }

  // 2. Guarda el producto final en la base de datos
  async agregarProducto(producto: any): Promise<void> {
    const { error } = await this.sbService.client.from('productos').insert([
      {
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        tiempo_elaboracion: producto.tiempoElaboracion, // <--- REVISA ESTA LÍNEA
        precio: producto.precio,
        tipo: producto.tipo,
        fotos: producto.fotos,
      },
    ]);

    if (error) throw error;
  }

  async waitingCustomer() {
    const response = await this.sbService.client
      .from('lista_espera')
      .select(
        `
        *,
        cliente:usuarios!lista_espera_user_id_fkey(*)     
        `,
      )
      .eq('en_espera', true);
    return response;
  }

  async insertProductsOrders(data: IProductOrderToLoad) {
    const response = await this.sbService.client.rpc(
      'insertar_productos_pedido',
      {
        p_id_pedido: data.id_pedido,
        p_productos: data.lista_productos.map((p) => ({
          id_producto: p.id,
          cantidad: p.cantidad,
          precio: p.precio,
        })),
        p_estado: data.estado,
      },
    );
    return response;
  }
}
