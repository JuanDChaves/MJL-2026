import { Injectable } from '@angular/core';
import { Camera  } from '@capacitor/camera';
@Injectable({
  providedIn: 'root',
})
export class PhotoService {
  async takePicture(): Promise<any> {
    try {
      const result = await Camera.takePhoto({
        quality: 90,
        includeMetadata: true,
      });

      console.log(result.webPath?.slice(5));
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
}
