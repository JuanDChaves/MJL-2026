import { inject, Injectable } from '@angular/core';
import {
  Camera,
  MediaTypeSelection,
} from '@capacitor/camera';
import { SupabaseService } from './supabase-service';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class PhotoService {
  private sbservice = inject(SupabaseService);
  

  async takePicture(): Promise<any> {
    try {
      const result = await Camera.takePhoto({
        quality: 90,
        includeMetadata: true,
      });

      // result.webPath can be set directly as the src of an image element

      // On native: pass result.uri to the Filesystem API to get the full-resolution base64,
      // or use result.thumbnail for a lower-resolution base64 preview.
      // On Web: result.thumbnail contains the full image base64 encoded.

      console.log('Format:', result.metadata?.format);
      console.log('Resolution:', result.metadata?.resolution);
      return result.webPath;
    } catch (e) {
      const error = e as any;
      // error.code contains the structured error code (e.g. 'OS-PLUG-CAMR-0003')
      // when thrown by the native layer. See the Errors section for all codes.
      const message = error.code
        ? `[${error.code}] ${error.message}`
        : error.message;
      console.error('takePhoto failed:', message);
    }
  }

  async chooseFromGallery() {
    try {
      const { results } = await Camera.chooseFromGallery({
        mediaType: MediaTypeSelection.All, // photos, videos, or both
        allowMultipleSelection: true,
        limit: 3,
        includeMetadata: true,
      });

      for (const item of results) {
        console.log('Type:', item.type); // MediaType.Photo or MediaType.Video
        console.log('webPath:', item.webPath);
        console.log('Format:', item.metadata?.format);
        console.log('Size:', item.metadata?.size);
      }

      return results;
    } catch (e) {
      const error = e as any;
      const message = error.code
        ? `[${error.code}] ${error.message}`
        : error.message;
      console.error('chooseFromGallery failed:', message);
      return [];
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
  private async uploadImage(file: Blob, nombreArchivo: string,folderName: string): Promise<string> {
    const imgPath = `${folderName}/${nombreArchivo}`;

    const { data, error } = await this.sbservice.client.storage
      .from(environment.bucketName)
      .upload(imgPath, file);

    if (error) throw error;

    return await this.getPublicUrl(imgPath);
  }

  /**
   * Gestión masiva: Sube las 3 fotos obligatorias de un producto (plato/bebida).
   */
  async uploadProductPhotos(
    fotosPaths: (string | null)[],
    nombreProd: string
  ): Promise<string[]> {
    const urls: string[] = [];
    for (let i = 0; i < fotosPaths.length; i++) {
      const path = fotosPaths[i];
      if (path) {
        const blob = await this.getPhotoBlob(path);
        const fileName = `${nombreProd.replace(
          /\s+/g,
          '_'
        )}_${i}_${Date.now()}.jpeg`;
        const url = await this.uploadImage(blob, fileName,'Products');
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

  async uploadProfilePhoto(file: Blob, nombreArchivo: string){
    return await this.uploadImage(file,nombreArchivo,'ProfilePhoto');
  }
}
