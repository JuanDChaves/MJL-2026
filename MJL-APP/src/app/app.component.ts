import { Component, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { SplashScreen } from '@capacitor/splash-screen';
import { SplashScreenComponent } from './splash-screen/splash-screen.component';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet, SplashScreenComponent],
})
export class AppComponent implements OnInit{
  showSplash = true;

  ngOnInit() {
    setTimeout(() => {
      this.showSplash = false;
    }, 3000)
  }

  constructor() {
    //  this.showSplashScreen();
  }


  async showSplashScreen() {
    await SplashScreen.show({
    autoHide: true,
    showDuration: 3000
    });
  }
}
