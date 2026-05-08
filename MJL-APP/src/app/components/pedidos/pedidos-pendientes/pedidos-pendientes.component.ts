import { Component, inject, OnInit, signal } from '@angular/core';
import { addIcons } from 'ionicons';
import { IUserUnauthorized } from 'src/app/interfaces/IUserUnauthorized';
import { checkmark, close, checkmarkCircle } from 'ionicons/icons';
import { UserService } from 'src/app/services/user-service';
import { LayoutComponent } from '../../layout/layout.component';
import { IonAvatar, IonButton, IonCard, IonCardContent, IonIcon, ViewWillEnter } from '@ionic/angular/standalone';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-pedidos-pendientes',
  templateUrl: './pedidos-pendientes.component.html',
  styleUrls: ['./pedidos-pendientes.component.scss'],
  imports: [
    IonCard,
    IonCardContent,
    IonAvatar,
    IonButton,
    IonIcon,
    DatePipe,
    LayoutComponent]
})
export class PedidosPendientesComponent  implements ViewWillEnter {
unauthorizedUsersList = signal<IUserUnauthorized[]>([]);
  userServ = inject(UserService);

  constructor() {
    addIcons({ checkmark, close, checkmarkCircle });
  }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
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
