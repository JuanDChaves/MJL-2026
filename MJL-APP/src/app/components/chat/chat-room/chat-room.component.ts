import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ViewWillEnter, IonIcon, IonButton } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chatbubblesOutline, chatbubbleOutline, restaurantOutline, starOutline, accessibilityOutline } from 'ionicons/icons';
import { LayoutComponent } from 'src/app/components/layout/layout.component';
import { IMesa } from 'src/app/interfaces/IMesa';
import { MesaService } from 'src/app/services/mesa-service';
import { UserService } from 'src/app/services/user-service';
import { TipoMesa } from 'src/app/types/TipoMesa';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.scss'],
  imports: [LayoutComponent, IonIcon, IonButton],
})
export class ChatRoomComponent implements ViewWillEnter {

  mesas = signal<IMesa[]>([]);
  mesaService = inject(MesaService);
  userService = inject(UserService);
  route = inject(Router);

  constructor() {
    addIcons({ chatbubblesOutline, chatbubbleOutline, restaurantOutline, starOutline, accessibilityOutline });
  }

  async ionViewWillEnter(): Promise<void> {
    await this.userService.loadUserData();
    const result = await this.mesaService.mesas();
    if (result.error) { console.log(result.error.message); return; }
    this.mesas.set(result.data!.sort((a, b) => a.numero_mesa - b.numero_mesa));
  }

  chatearConMesa(mesa: IMesa) {
    if (!mesa.ocupada) return;
    this.route.navigate(['/chat', mesa.id, mesa.numero_mesa]);
  }

  getIconForType(tipo: TipoMesa): string {
    switch (tipo) {
      case 'vip': return 'star-outline';
      case 'movilidadReducida': return 'accessibility-outline';
      default: return 'restaurant-outline';
    }
  }

  getBadgeLabel(tipo: TipoMesa): string {
    switch (tipo) {
      case 'vip': return 'VIP';
      case 'movilidadReducida': return 'ACCESIBLE';
      default: return 'ESTÁNDAR';
    }
  }

  getTipoDesc(tipo: TipoMesa): string {
    switch (tipo) {
      case 'vip': return 'Mesa preferencial con servicio exclusivo';
      case 'movilidadReducida': return 'Acceso adaptado y espacio extra';
      default: return 'Mesa estándar';
    }
  }

}
