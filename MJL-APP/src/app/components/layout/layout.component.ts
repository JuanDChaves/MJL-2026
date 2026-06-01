import { Component, inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonButtons, IonIcon, IonBackButton } from '@ionic/angular/standalone';
import { UserService } from '../../services/user-service';
import { LoginService } from '../../services/login-service';
import { LocalStorageService } from '../../services/local-storage-service';
import { PushNotificationService } from '../../services/push-notification-service';
import { addIcons } from 'ionicons';
import { powerSharp } from 'ionicons/icons';
import { ToastService } from 'src/app/services/toast-service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonButtons, IonIcon, IonBackButton],
})
export class LayoutComponent {
  @Input() title: string = 'MJL Bar';
  @Input() showBackButton: boolean = false;
  @Input() backUrl: string = '/home';

  userServ = inject(UserService);
  loginServ = inject(LoginService);
  storageServ = inject(LocalStorageService);
  pushServ = inject(PushNotificationService);
  router = inject(Router);
  toastService = inject(ToastService);

  constructor() {
    addIcons({ powerSharp });
  }

  async closeSession() {
    let error: string = '';
    const resultRemoveToken = await this.pushServ.removeTokenFromDb();
    if(resultRemoveToken.error) error = resultRemoveToken.error.message;
    const resultCloseSession = await this.loginServ.closeSession();
    if(resultCloseSession.error) error = resultCloseSession.error.message;
    if(error) return this.toastService.showError(error);
    await this.storageServ.clearData();
    await this.userServ.loadUserData();
    this.backToLogin();
  }

  backToLogin() {
    this.router.navigate(['/login']);
  }

  goBack() {
    this.router.navigate([this.backUrl]);
  }
}
