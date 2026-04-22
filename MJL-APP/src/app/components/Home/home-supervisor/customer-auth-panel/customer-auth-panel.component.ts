import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonCardSubtitle, IonAvatar, IonButton, IonIcon, ViewWillEnter } from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import { checkmark, close, checkmarkCircle } from 'ionicons/icons';
import { IUserUnauthorized } from 'src/app/interfaces/IUserUnauthorized';
import { UserService } from 'src/app/services/user-service';

@Component({
  selector: 'app-customer-auth-panel',
  templateUrl: './customer-auth-panel.component.html',
  styleUrls: ['./customer-auth-panel.component.scss'],
  imports: [IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonCardSubtitle, IonAvatar, IonButton, IonIcon, DatePipe],
})
export class CustomerAuthPanelComponent implements ViewWillEnter {

  unauthorizedUsersList = signal<IUserUnauthorized[]>([])
  userServ = inject(UserService)

  constructor() {
    addIcons({ checkmark, close, checkmarkCircle });
  }

  async ionViewWillEnter(): Promise<void> {
    const response = await this.userServ.getUnauthorizedUsers();
    if (response.error) {
      this.unauthorizedUsersList.set([]);
      return;
    }
    this.unauthorizedUsersList.set(response.data as IUserUnauthorized[]);
  }

}