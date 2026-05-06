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
  selector: 'app-home-cantinero',
  templateUrl: './home-cantinero.page.html',
  styleUrls: ['./home-cantinero.page.scss'],
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonTitle,
    IonContent, IonIcon,
    IonButton
],
})

export class HomeCantineroPage implements OnInit {

  constructor(private router: Router) {
    addIcons({ addCircleOutline, checkmarkCircleOutline, bicycleOutline });
  }
 
  agregarPlato() {
    this.router.navigate(['/agregar-plato']);
  }
 
  verificarPedido() {
    this.router.navigate(['/verificar-pedido']);
  }
 
  entregarPedido() {
    this.router.navigate(['/entregar-pedido']);
  }
  ngOnInit() {
  }

}
