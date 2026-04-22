import { inject, Injectable } from '@angular/core';
import { SupabaseService } from './supabase-service';

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
    data: Omit<T, 'id'>
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
    column:string,
    value: any,
    data: Partial<T>
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

  async getAllWithFilter(table: string,filter:string,value:any): Promise<{ data: T[] | null; error: any }> {
    const { data, error } = await this.sbService.client
      .from(table)
      .select('*')
      .eq(filter, value);
    return { data: data as T[] | null, error };
  }

  async getAll(table: string): Promise<{ data: T[] | null; error: any }> {
    const { data, error } = await this.sbService.client
      .from(table)
      .select('*');
    return { data: data as T[] | null, error };
  }

  async getOneById(
    table: string,
    id: string
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
    email: string
  ): Promise<{ data: T | null; error: any }> {
    const { data, error } = await this.sbService.client
      .from(table)
      .select('*')
      .eq('correo_electronico', email)
      .single();
    return { data: data as T | null, error };
  }

  //aca el id es el dni o cuil del usuario
  async userExist(table:string, identificacion:string,): Promise<boolean>{
    const responseId = await  this.sbService.client
      .from(table)
      .select('*')
      .eq('identificacion',identificacion)
      .single()      
    return responseId.data !== null
  }
}
