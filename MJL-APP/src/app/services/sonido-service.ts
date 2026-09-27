import { Injectable } from '@angular/core';
import { NativeAudio } from '@capacitor-community/native-audio';
import { Capacitor } from '@capacitor/core';
import { Howl } from 'howler';

@Injectable({
  providedIn: 'root',
})
export class SonidoService {
  async preload() {
    const isNative = Capacitor.isNativePlatform();
    const path = isNative ? 'public/assets/sounds/' : '';

    await NativeAudio.preload({ assetId: 'open', assetPath: `${path}open.mp3`, isUrl:false });
    await NativeAudio.preload({ assetId: 'close', assetPath: `${path}close.mp3`, isUrl: false });
  }

  async playOpen() { await NativeAudio.play({ assetId: 'open' }); }
  async playClose() { await NativeAudio.play({ assetId: 'close' }); }
}