import { Component, inject } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonButtons, IonIcon } from '@ionic/angular/standalone';
import { UserService } from '../services/user-service';
import { addIcons } from 'ionicons';
import {  personCircle, powerSharp } from 'ionicons/icons';
import { LoginService } from '../services/login-service';
import { Router } from '@angular/router';

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

  constructor() {
    addIcons({powerSharp,personCircle});
  }

  closeSession(){
    console.log('cerrar session');
    this.loginServ.closeSession();
    this.router.navigate(['/login']);
  }

  backToLogin(){
    this.router.navigate(['/login']);
  }

}
