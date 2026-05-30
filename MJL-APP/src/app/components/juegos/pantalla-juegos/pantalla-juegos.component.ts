import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { IonCard, IonCardContent, IonButton, IonIcon } from '@ionic/angular/standalone';
import { LayoutComponent } from '../../layout/layout.component';
import { addIcons } from 'ionicons';
import { gameControllerOutline, trophyOutline, helpCircleOutline, textOutline } from 'ionicons/icons';
import { register } from 'swiper/element/bundle';

register();

interface GameItem {
  name: string;
  icon: string;
  route: string;
  description: string;
  disabled: boolean;
}

@Component({
  selector: 'app-pantalla-juegos',
  templateUrl: './pantalla-juegos.component.html',
  styleUrls: ['./pantalla-juegos.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [IonCard, IonCardContent, IonButton, IonIcon, RouterLink, LayoutComponent],
})
export class PantallaJuegosComponent {
  private route = inject(ActivatedRoute);

  backUrl = `/detalle-pedido/${this.route.snapshot.queryParamMap.get('pedidoId') ?? ''}`;

  games: GameItem[] = [
    {
      name: 'Mayor o Menor',
      icon: 'trophy-outline',
      route: '/mayor-menor',
      description: 'Adiviná si la carta es mayor o menor y ganá descuentos',
      disabled: false,
    },
    {
      name: 'Ruleta',
      icon: 'game-controller-outline',
      route: '/ruleta',
      description: 'Girá la ruleta y ganá descuentos exclusivos',
      disabled: false,
    },
    {
      name: 'El Ahoracado',
      icon: 'text-outline',
      route: '/ahoracado',
      description: 'Adivina una palabra en menos de 5 intentos',
      disabled: false,
    },
  ];

  constructor() {
    addIcons({ gameControllerOutline, trophyOutline, helpCircleOutline, textOutline });
  }
}
