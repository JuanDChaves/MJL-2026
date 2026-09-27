import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonButton, IonIcon, ViewWillEnter } from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import { addCircleOutline, listOutline, qrCodeOutline } from 'ionicons/icons';
import { UserService } from 'src/app/services/user-service';

@Component({
  selector: 'app-home-supervisor',
  templateUrl: './home-supervisor.component.html',
  styleUrls: ['./home-supervisor.component.scss'],
  imports: [IonButton, RouterLink, IonIcon],
})
export class HomeSupervisorComponent implements ViewWillEnter {

  userService = inject(UserService)

  constructor() { 
    addIcons({listOutline,addCircleOutline,qrCodeOutline})
  }
  async ionViewWillEnter(): Promise<void> {
    await this.userService.loadUserData();
  }


}
