import { Injectable } from '@angular/core';
import { NativeAudio } from '@capacitor-community/native-audio';
import { Howl } from 'howler';

@Injectable({
  providedIn: 'root',
})
export class SonidoService {
  async preload() {
    await NativeAudio.preload({ assetId: 'open', assetPath: 'open.mp3' });
    await NativeAudio.preload({ assetId: 'close', assetPath: 'close.mp3' });
  }

  async playOpen() { await NativeAudio.play({ assetId: 'open' }); }
  async playClose() { await NativeAudio.play({ assetId: 'close' }); }
}
