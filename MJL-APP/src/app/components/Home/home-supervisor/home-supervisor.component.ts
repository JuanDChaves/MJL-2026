import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonButton, IonIcon } from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import { addCircleOutline, listOutline, qrCodeOutline } from 'ionicons/icons';

@Component({
  selector: 'app-home-supervisor',
  templateUrl: './home-supervisor.component.html',
  styleUrls: ['./home-supervisor.component.scss'],
  imports: [IonButton, RouterLink, IonIcon],
})
export class HomeSupervisorComponent {
  constructor() { 
    addIcons({listOutline,addCircleOutline,qrCodeOutline})
  }
}
