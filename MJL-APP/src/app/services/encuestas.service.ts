import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase-service';

@Injectable({
  providedIn: 'root'
})
export class EncuestasService {

  constructor(private db: SupabaseService) { }

  /**
   * Verifica si ya se respondió la encuesta para la estadía actual.
   */
  async verificarEncuestaPrevia(idEstadia: string): Promise<boolean> {
    if (!idEstadia) return false; // Si no hay estadía, por las dudas asumimos falso

    try {
      const { data, error } = await this.db.client
        .from('encuestas')
        .select('id')
        .eq('id_estadia', idEstadia); // Buscamos coincidencia exacta de estadía

      if (error) {
        console.error('Error al consultar estadía previa:', error);
        return false;
      }

      return data && data.length > 0;
    } catch (error) {
      console.error('Error inesperado:', error);
      return false;
    }
  }

  /**
   * Guarda la encuesta incluyendo el ID de estadía.
   */
  async guardarEncuesta(encuestaData: any): Promise<void> {
    const { error } = await this.db.client
      .from('encuestas')
      .insert(encuestaData);

    if (error) throw error; 
  }

  async obtenerTodasLasEncuestas() {
    const { data, error } = await this.db.client
      .from('encuestas')
      .select('*');

    if (error) {
      console.error('Error al traer encuestas para gráficos:', error);
      return [];
    }
    return data || [];
  }
}