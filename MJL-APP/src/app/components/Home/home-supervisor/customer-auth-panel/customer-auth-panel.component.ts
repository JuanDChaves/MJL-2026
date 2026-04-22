import { Component, OnInit } from '@angular/core';
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonList, IonCardSubtitle, IonThumbnail, IonLabel, IonButton, IonText } from "@ionic/angular/standalone";

@Component({
  selector: 'app-customer-auth-panel',
  templateUrl: './customer-auth-panel.component.html',
  styleUrls: ['./customer-auth-panel.component.scss'],
  imports: [IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonList, IonCardSubtitle, IonThumbnail, IonLabel, IonButton, IonText],
})
export class CustomerAuthPanelComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
