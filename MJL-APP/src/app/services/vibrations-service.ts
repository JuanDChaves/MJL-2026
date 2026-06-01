import { Injectable } from '@angular/core';
import { Haptics } from '@capacitor/haptics';


@Injectable({
  providedIn: 'root',
})
export class VibrationsService {
  async vibrate(){
    await Haptics.vibrate({duration: 500});
  }
}
