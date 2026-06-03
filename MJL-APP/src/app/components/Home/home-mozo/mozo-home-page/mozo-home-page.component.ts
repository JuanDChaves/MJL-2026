import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonButton, IonIcon } from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import { cashOutline, chatbubbleEllipsesOutline, clipboardOutline, hourglassOutline  } from 'ionicons/icons';


@Component({
  selector: 'app-mozo-home-page',
  templateUrl: './mozo-home-page.component.html',
  styleUrls: ['./mozo-home-page.component.scss'],
  imports: [IonButton, RouterLink, IonIcon]
})
export class MozoHomePageComponent {

  constructor() { 
    addIcons({clipboardOutline,hourglassOutline,chatbubbleEllipsesOutline,cashOutline})
  }


}
