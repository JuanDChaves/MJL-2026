import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { SplashScreenComponent } from './splash-screen/splash-screen.component';
import { SonidoService } from './services/sonido-service';
import { NativeAudio } from '@capacitor-community/native-audio';
import { App } from '@capacitor/app'

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet, SplashScreenComponent],
})
export class AppComponent implements OnInit, OnDestroy{
  sonido = inject(SonidoService);
  showSplash = true;

  async ngOnInit() {
    await this.sonido.preload();
    await this.sonido.playOpen();
    setTimeout(() => {
      this.showSplash = false;
    }, 3000)

    App.addListener('appStateChange', async ({ isActive }) => {
      if(!isActive) {
        await this.sonido.playClose();
      }
    })
  }

  constructor() {
    this.sonido.playOpen();
  }

  async ngOnDestroy() {
    this.sonido.playClose();
    await NativeAudio.play({assetId: 'close'});
  }
}
