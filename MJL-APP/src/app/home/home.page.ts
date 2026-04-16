import { Component, inject } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonButtons, IonIcon } from '@ionic/angular/standalone';
import { UserService } from '../services/user-service';
import { addIcons } from 'ionicons';
import {  personCircle, powerSharp } from 'ionicons/icons';
import { LoginService } from '../services/login-service';
import { Router } from '@angular/router';
import { LocalStorageService } from '../services/local-storage-service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonButtons, IonIcon],
})
export class HomePage {
  userServ = inject(UserService)
  loginServ = inject(LoginService)
  router = inject(Router)
  storageServ = inject(LocalStorageService)

  constructor() {
    addIcons({powerSharp,personCircle});
  }

  async closeSession(){
    console.log('cerrar session');
    await this.loginServ.closeSession();
    await this.storageServ.clearData();
    this.backToLogin();
  }

  backToLogin(){
    this.router.navigate(['/login']);
  }

}
