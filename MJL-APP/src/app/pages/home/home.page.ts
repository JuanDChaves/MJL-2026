import { Component, inject } from '@angular/core';
import { ViewWillEnter } from '@ionic/angular/standalone';
import { UserService } from '../../services/user-service';
import { HomeSupervisorComponent } from '../../components/Home/home-supervisor/home-supervisor.component';
import { LayoutComponent } from '../../components/layout/layout.component';
import { HomeCocineroPage } from "src/app/components/Home/home-cocinero/home-cocinero.page";
import { MozoHomePageComponent } from "../../components/Home/home-mozo/mozo-home-page/mozo-home-page.component";
import { HomeCantineroPage } from 'src/app/components/Home/home-cantinero/home-cantinero.page';
import { HomeClienteComponent } from "src/app/components/Home/home-cliente/home-cliente.component";
import { HomeMetreComponent } from "src/app/components/Home/home-metre/home-metre.component";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [HomeSupervisorComponent, LayoutComponent, MozoHomePageComponent, HomeCocineroPage, HomeCantineroPage, HomeClienteComponent, HomeMetreComponent],
})
export class HomePage implements ViewWillEnter {
  userServ = inject(UserService);

  async ionViewWillEnter() {
    await this.userServ.loadUserData();
  }
}
