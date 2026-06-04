import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonIcon, IonButton } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  addCircleOutline,
  checkmarkCircleOutline,
  bicycleOutline
} from 'ionicons/icons';
 
@Component({
  selector: 'app-home-cantinero',
  templateUrl: './home-cantinero.page.html',
  styleUrls: ['./home-cantinero.page.scss'],
  standalone: true,
  imports: [
    IonIcon,
    IonButton
],
})

export class HomeCantineroPage {

  constructor(private router: Router) {
    addIcons({ addCircleOutline, checkmarkCircleOutline, bicycleOutline });
  }
 
  agregarPlato() {
    this.router.navigate(['/alta-producto']); 
  }
 
  prepararPedidos() {
    this.router.navigate(['/preparar-pedido'],{queryParams: {rol: 'cantinero'}});
  }
}
