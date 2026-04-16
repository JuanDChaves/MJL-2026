import { Component, inject, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonButtons, IonIcon } from '@ionic/angular/standalone';
import { UserService } from '../services/user-service';
import { addIcons } from 'ionicons';
import {  personCircle, powerSharp } from 'ionicons/icons';
import { LoginService } from '../services/login-service';
import { Router, RouterLink, } from '@angular/router';
import { LocalStorageService } from '../services/local-storage-service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonButtons, IonIcon, RouterLink],
})
export class HomePage implements OnInit{
  userServ = inject(UserService)
  loginServ = inject(LoginService)
  router = inject(Router)
  storageServ = inject(LocalStorageService)

  constructor() {
    addIcons({powerSharp,personCircle});
    
  }
  async ngOnInit() {
    await this.loadUserData();
  }

  async loadUserData(){
    await this.userServ.loadUserData();
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
