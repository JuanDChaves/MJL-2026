import { Component, inject } from '@angular/core';
import { ViewWillEnter } from '@ionic/angular/standalone';
import { UserService } from '../../services/user-service';
import { HomeSupervisorComponent } from '../../components/Home/home-supervisor/home-supervisor.component';
import { LayoutComponent } from '../../components/layout/layout.component';
import { HomeCocineroPage } from "src/app/components/Home/home-cocinero/home-cocinero.page";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  imports: [LayoutComponent, HomeCocineroPage, HomeSupervisorComponent]
})
export class HomePage implements ViewWillEnter {
  userServ = inject(UserService);

  async ionViewWillEnter() {
    await this.userServ.loadUserData();
  }
}
