import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import {
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonCardSubtitle,
  IonAvatar,
  IonButton,
  IonIcon,
  ViewWillEnter,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmark, close, checkmarkCircle } from 'ionicons/icons';
import { IUserUnauthorized } from '../../../../interfaces/IUserUnauthorized';
import { UserService } from '../../../../services/user-service';

@Component({
  selector: 'app-customer-auth-panel',
  templateUrl: './customer-auth-panel.component.html',
  styleUrls: ['./customer-auth-panel.component.scss'],
  imports: [
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonCardSubtitle,
    IonAvatar,
    IonButton,
    IonIcon,
    DatePipe,
  ],
})
export class CustomerAuthPanelComponent implements ViewWillEnter {
  unauthorizedUsersList = signal<IUserUnauthorized[]>([]);
  userServ = inject(UserService);

  constructor() {
    addIcons({ checkmark, close, checkmarkCircle });
  }

  async ionViewWillEnter(): Promise<void> {
    await this.loadUser();
  }

  async rejectUser(user: IUserUnauthorized) {
    await this.userServ.enableOrRejectUser(
      user.identificacion.toString(),
      false
    );
    await this.reloadUsersList(user);
  }

  async enableUser(user: IUserUnauthorized) {
    await this.userServ.enableOrRejectUser(
      user.identificacion.toString(),
      true
    );
    await this.reloadUsersList(user);
  }

  private reloadUsersList(user: IUserUnauthorized): Promise<void> {
    return new Promise(() => {
      this.unauthorizedUsersList.update((users) =>
        users.filter((u) => u.identificacion !== user.identificacion)
      );
    });
  }

  private async loadUser() {
    const response = await this.userServ.getUnauthorizedUsers();
    if (response.error) {
      this.unauthorizedUsersList.set([]);
      return;
    }
    this.unauthorizedUsersList.set(response.data as IUserUnauthorized[]);
  }
}
