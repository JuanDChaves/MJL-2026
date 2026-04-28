import { inject, Injectable, OnInit } from '@angular/core';
import { Camera  } from '@capacitor/camera';
import { SupabaseService } from './supabase-service';
import { environment } from 'src/environments/environment.prod';
@Injectable({
  providedIn: 'root',
})
export class PhotoService {
  sbservice = inject(SupabaseService);

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

  async uploadImage(file:Blob, dni:string): Promise<string> {
    const imgPath = environment.bucketName + '/' + dni;
    const {data,error} =  await this.sbservice.client.storage
      .from(environment.bucketName)
      .upload(imgPath, file);
    if (error) {
      console.error('Error al subir el archivo: ', error);
    }

    return await this.getPublicUrl(imgPath);

  }

  async getPublicUrl( filePath: string) {
    const { data } = this.sbservice.client.storage
      .from(environment.bucketName)
      .getPublicUrl(filePath);

    return data.publicUrl;
  }

  async getPhotoBlob(webPath:string){
    const resp = await fetch(webPath);
    return await resp.blob();
  }

}
