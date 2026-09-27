import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addCircleOutline, pencilOutline } from 'ionicons/icons';

@Component({
  selector: 'app-home-metre',
  templateUrl: './home-metre.component.html',
  styleUrls: ['./home-metre.component.scss'],
  imports: [IonButton, IonIcon, RouterLink],
})
export class HomeMetreComponent {
  

  constructor() {
    addIcons({ addCircleOutline, pencilOutline });
  }

}
