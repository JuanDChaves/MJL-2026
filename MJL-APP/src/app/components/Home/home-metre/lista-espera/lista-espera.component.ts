import { Component, OnInit, signal } from '@angular/core';
import {
  IonIcon,
  ViewWillEnter,
  IonButton,
  IonAvatar,
  IonCardContent,
  IonCard,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmark, checkmarkCircle, close } from 'ionicons/icons';
import { LayoutComponent } from 'src/app/components/layout/layout.component';

@Component({
  selector: 'app-lista-espera',
  templateUrl: './lista-espera.component.html',
  styleUrls: ['./lista-espera.component.scss'],
  imports: [
    LayoutComponent,
    IonIcon,
    IonButton,
    IonAvatar,
    IonCardContent,
    IonCard,
  ],
})
export class ListaEsperaComponent implements ViewWillEnter {
  clientesEnEsperaList = signal<any[]>([]);

  
  constructor() {
    addIcons({ checkmark, close, checkmarkCircle });
  }
  
  ionViewWillEnter(): void {}

  async cargarclientesEnEsperaList(): Promise<void> {}

  asignarMesa(_t4: any) {
    throw new Error('Method not implemented.');
  }
}
