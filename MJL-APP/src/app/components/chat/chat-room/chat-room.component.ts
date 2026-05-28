import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ViewWillEnter, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chatbubblesOutline } from 'ionicons/icons';
import { LayoutComponent } from 'src/app/components/layout/layout.component';
import { IMesa } from 'src/app/interfaces/IMesa';
import { MesaService } from 'src/app/services/mesa-service';
import { UserService } from 'src/app/services/user-service';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.scss'],
  imports: [LayoutComponent, IonIcon],
})
export class ChatRoomComponent implements ViewWillEnter {

  mesasOcupadas = signal<IMesa[]>([]);
  mesaService = inject(MesaService);
  userService = inject(UserService);
  route = inject(Router);

  constructor() {
    addIcons({ chatbubblesOutline });
  }

  async ionViewWillEnter(): Promise<void> {
    await this.userService.loadUserData();
    const result = await this.mesaService.mesasOcupadas();
    if (result.error) {
      console.log(result.error.message);
      return;
    }
    this.mesasOcupadas.set(result.data!.sort((a, b) => a.numero_mesa - b.numero_mesa));
  }

  chatearConMesa(mesa: IMesa) {
    this.route.navigate(['/chat', mesa.id,mesa.numero_mesa]);
  }

}
