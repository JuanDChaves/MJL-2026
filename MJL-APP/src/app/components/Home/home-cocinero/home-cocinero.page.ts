import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonNote, IonContent, IonIcon, IonButton } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  addCircleOutline,
  checkmarkCircleOutline,
  bicycleOutline
} from 'ionicons/icons';
 
@Component({
  selector: 'app-home-cocinero',
  templateUrl: './home-cocinero.page.html',
  styleUrls: ['./home-cocinero.page.scss'],
  standalone: true,
  imports: [
    IonIcon,
    IonButton
],
})
export class HomeCocineroPage {

  constructor(private router: Router) {
    addIcons({ addCircleOutline, checkmarkCircleOutline, bicycleOutline });
  }
 
  agregarPlato() {
    this.router.navigate(['/alta-producto']); 
  }
 
  prepararPedidos() {
    this.router.navigate(['/preparar-pedido'], {queryParams: {rol: 'cocinero'}});
  }

}
