import { Component, inject } from '@angular/core';
import { ViewWillEnter } from '@ionic/angular/standalone';
import { UserService } from '../../services/user-service';
import { HomeSupervisorComponent } from '../../components/Home/home-supervisor/home-supervisor.component';
import { LayoutComponent } from '../../components/layout/layout.component';
import { MozoHomePageComponent } from "../../components/Home/home-mozo/mozo-home-page/mozo-home-page.component";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [HomeSupervisorComponent, LayoutComponent, MozoHomePageComponent],
})
export class HomePage implements ViewWillEnter {
  userServ = inject(UserService);

  async ionViewWillEnter() {
    await this.userServ.loadUserData();
  }
}
