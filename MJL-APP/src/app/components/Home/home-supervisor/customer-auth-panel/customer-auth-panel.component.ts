import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import {
  IonCard,
  IonCardContent,
  IonAvatar,
  IonButton,
  IonIcon,
  ViewWillEnter,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmark, close, checkmarkCircle } from 'ionicons/icons';
import { IUserUnauthorized } from '../../../../interfaces/IUserUnauthorized';
import { UserService } from '../../../../services/user-service';
import { LayoutComponent } from '../../../../components/layout/layout.component';
import { SendEmailService } from 'src/app/services/send-email-service';
import { IEmailData } from 'src/app/interfaces/IEmailData';
import { ToastService } from 'src/app/services/toast-service';

@Component({
  selector: 'app-customer-auth-panel',
  templateUrl: './customer-auth-panel.component.html',
  styleUrls: ['./customer-auth-panel.component.scss'],
  imports: [
    IonCard,
    IonCardContent,
    IonAvatar,
    IonButton,
    IonIcon,
    DatePipe,
    LayoutComponent,
  ],
})
export class CustomerAuthPanelComponent implements ViewWillEnter {
  unauthorizedUsersList = signal<IUserUnauthorized[]>([]);
  userServ = inject(UserService);
  sendEmailServ = inject(SendEmailService);
  toastService = inject(ToastService);

  constructor() {
    addIcons({ checkmark, close, checkmarkCircle });
  }

  async ionViewWillEnter(): Promise<void> {
    await this.loadUser();
  }

  async rejectUser(user: IUserUnauthorized) {
    const emailData: IEmailData  = {
      emailToSend: user.correo_electronico,
      nombre: user.nombres,
      apellido: user.apellidos,
      resultado: false
    }
    const result = await this.sendEmailServ.sendEmail(emailData);
    if(!result.success) return await this.toastService.showError(result.error?.message!);
    const result_reject =await this.userServ.enableOrRejectUser(
      user.dni.toString(),
      false
    );
    if(!result_reject.success) await this.toastService.showError(result_reject.error?.message!);
    await this.reloadUsersList(user);
  }

  async enableUser(user: IUserUnauthorized) {
    const emailData: IEmailData  = {
      emailToSend: user.correo_electronico,
      nombre: user.nombres,
      apellido: user.apellidos,
      resultado: true
    }
    const result = await this.sendEmailServ.sendEmail(emailData);
    if(!result.success) return await this.toastService.showError(result.error?.message!);
    const result_enable =await this.userServ.enableOrRejectUser(
      user.dni.toString(),
      true
    );
    if(!result_enable.success) await this.toastService.showError(result_enable.error?.message!);
    await this.reloadUsersList(user);
  }

  private reloadUsersList(user: IUserUnauthorized): Promise<void> {
    return new Promise(() => {
      this.unauthorizedUsersList.update((users) =>
        users.filter((u) => u.dni !== user.dni)
      );
    });
  }

  private async loadUser() {
    const response = await this.userServ.getUnauthorizedUsers();
    if (response.error) {
      await this.toastService.showError(response.error?.message!);
      this.unauthorizedUsersList.set([]);
      return;
    }
    this.unauthorizedUsersList.set(response.data as IUserUnauthorized[]);
  }
}
