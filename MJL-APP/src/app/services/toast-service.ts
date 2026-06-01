import { inject, Injectable } from '@angular/core';
import { VibrationsService } from './vibrations-service';
import { ToastController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { closeOutline } from 'ionicons/icons';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  vibrationServ = inject(VibrationsService);
  toastCtrl = inject(ToastController)

  /**
   *
   */
  constructor() {
    addIcons({ closeOutline });
  }

  async showError(msg: string){
    const toast = await this.toastCtrl.create({
      position:'bottom',
      message: msg,
      duration: 2000,
      color:'danger',
      buttons: [{
        icon: closeOutline,
        role: 'cancel'
      }]
    });
    toast.present().then(() => this.vibrationServ.vibrate());
  }
}
