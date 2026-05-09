import { inject, Injectable } from '@angular/core';
import { Camera, CameraSource, CameraResultType } from '@capacitor/camera';
import { SupabaseService } from './supabase-service';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class PhotoService {
  private sbservice = inject(SupabaseService);

  /**
   * Toma una fotografía utilizando la cámara del dispositivo.
   * @param origen Define si se abre la cámara directamente o se da opción a la galería.
   * Por defecto usa 'Prompt' (Cámara o Galería).
   */
  async takePicture(origen: CameraSource = CameraSource.Prompt): Promise<string | null> {
    try {
      const result = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: origen, // Parámetro clave para cumplir con las restricciones del TP
      });

      return result.webPath || null;
    } catch (e) {
      console.error('Error al capturar imagen:', e);
      return null;
    }
  }

  /**
   * Convierte un webPath de Capacitor en un Blob para subir a la DB.
   */
  async getPhotoBlob(webPath: string): Promise<Blob> {
    const resp = await fetch(webPath);
    return await resp.blob();
  }

  /**
   * Sube una imagen individual al bucket de Supabase.
   * @param file Archivo en formato Blob.
   * @param nombreArchivo Ruta y nombre dentro del storage.
   */
  async uploadImage(file: Blob, nombreArchivo: string): Promise<string> {
    const imgPath = `${environment.bucketName}/${nombreArchivo}`;
    
    const { data, error } = await this.sbservice.client.storage
      .from(environment.bucketName)
      .upload(imgPath, file);

    if (error) throw error;

    return await this.getPublicUrl(imgPath);
  }

  /**
   * Gestión masiva: Sube las 3 fotos obligatorias de un producto (plato/bebida).
   */
  async uploadProductPhotos(fotosPaths: (string | null)[], nombreProd: string): Promise<string[]> {
    const urls: string[] = [];
    for (let i = 0; i < fotosPaths.length; i++) {
      const path = fotosPaths[i];
      if (path) {
        const blob = await this.getPhotoBlob(path);
        const fileName = `productos/${nombreProd.replace(/\s+/g, '_')}_${i}_${Date.now()}.jpeg`;
        const url = await this.uploadImage(blob, fileName);
        urls.push(url);
      }
    }
    return urls;
  }

  private async getPublicUrl(filePath: string) {
    const { data } = this.sbservice.client.storage
      .from(environment.bucketName)
      .getPublicUrl(filePath);
    return data.publicUrl;
  }
}