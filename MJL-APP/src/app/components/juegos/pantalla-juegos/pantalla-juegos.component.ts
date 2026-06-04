import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { IonButton, IonIcon } from '@ionic/angular/standalone';
import { LayoutComponent } from '../../layout/layout.component';
import { addIcons } from 'ionicons';
import { playOutline } from 'ionicons/icons';
import { register } from 'swiper/element/bundle';

register();

interface GameItem {
  name: string;
  icon: string;
  route: string;
  description: string;
  disabled: boolean;
  url: string;
  category: 'Cartas' | 'Ruleta' | 'Palabras';
}

@Component({
  selector: 'app-pantalla-juegos',
  templateUrl: './pantalla-juegos.component.html',
  styleUrls: ['./pantalla-juegos.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [IonButton, IonIcon, RouterLink, LayoutComponent],
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
      url: 'assets/juegos/display/mayor_menor.png',
      category: 'Cartas',
    },
    {
      name: 'Ruleta',
      icon: 'game-controller-outline',
      route: '/ruleta',
      description: 'Girá la ruleta y ganá descuentos exclusivos',
      disabled: false,
      url: 'assets/juegos/display/ruleta.png',
      category: 'Ruleta',
    },
    {
      name: 'El Ahorcado',
      icon: 'text-outline',
      route: '/ahorcado',
      description: 'Adivina una palabra en menos de 5 intentos',
      disabled: false,
      url: 'assets/juegos/display/ahorcado.png',
      category: 'Palabras',
    },
  ];

  constructor() {
    addIcons({ playOutline });
  }
}
