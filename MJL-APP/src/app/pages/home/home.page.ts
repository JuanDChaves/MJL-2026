import { Component, inject } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonButtons, IonIcon, ViewWillEnter } from '@ionic/angular/standalone';
import { UserService } from '../../services/user-service';
import { addIcons } from 'ionicons';
import {  personCircle, powerSharp } from 'ionicons/icons';
import { LoginService } from '../../services/login-service';
import { Router, RouterLink, } from '@angular/router';
import { LocalStorageService } from '../../services/local-storage-service';
import { HomeSupervisorComponent } from "../../components/Home/home-supervisor/home-supervisor.component";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonButtons, IonIcon, RouterLink, HomeSupervisorComponent],
})
export class HomePage implements  ViewWillEnter{
  userServ = inject(UserService)
  loginServ = inject(LoginService)
  router = inject(Router)
  storageServ = inject(LocalStorageService)

  constructor() {
    addIcons({powerSharp,personCircle});
    
  }
  async ionViewWillEnter() {
    await this.loadUserData();
    console.log(this.userServ.userData());
  }
  
  async loadUserData(){
    await this.userServ.loadUserData();
  }

  async closeSession(){
    console.log('cerrar session');
    await this.loginServ.closeSession();
    await this.storageServ.clearData();
    await this.userServ.loadUserData();
    this.backToLogin();
  }

  backToLogin(){
    this.router.navigate(['/login']);
  }

}
