import { Component, inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonButtons, IonIcon, IonBackButton } from '@ionic/angular/standalone';
import { UserService } from '../../services/user-service';
import { LoginService } from '../../services/login-service';
import { LocalStorageService } from '../../services/local-storage-service';
import { addIcons } from 'ionicons';
import { powerSharp } from 'ionicons/icons';

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
  router = inject(Router);

  constructor() {
    addIcons({ powerSharp });
  }

  async closeSession() {
    console.log('cerrar session');
    await this.loginServ.closeSession();
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
