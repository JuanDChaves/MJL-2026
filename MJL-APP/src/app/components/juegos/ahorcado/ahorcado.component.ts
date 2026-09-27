import {
  Component,
  computed,
  inject,
  OnInit,
  Signal,
  signal,
  viewChild,
  WritableSignal,
} from '@angular/core';
import { IonLabel, ViewWillEnter } from '@ionic/angular/standalone';
import { ManejadorJuegos } from 'src/app/services/manejador-juegos';
import {
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonList,
  IonIcon,
  IonButton,
  IonItem,
} from '@ionic/angular/standalone';
import { LayoutComponent } from 'src/app/components/layout/layout.component';
import { KeyboardComponent } from './keyboard/keyboard.component';
import {
  heart,
  heartOutline,
  pricetagOutline,
  alertCircleOutline,
  checkmarkCircleOutline,
  closeCircleOutline,
  playCircleOutline,
  starOutline,
  timeOutline,
  warningOutline,
} from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { ConstantPool } from '@angular/compiler';

@Component({
  selector: 'app-ahorcado',
  templateUrl: './ahorcado.component.html',
  styleUrls: ['./ahorcado.component.scss'],
  imports: [
    IonCard,
    IonCardContent,
    IonItem,
    IonLabel,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonContent,
    IonList,
    IonButton,
    IonIcon,
    LayoutComponent,
    KeyboardComponent,
  ],
})
export class AhorcadoComponent implements ViewWillEnter {
  manejador = inject(ManejadorJuegos);
  juegoEmpezado = signal<boolean>(false);
  juegoTerminado = signal<boolean>(false);
  porcentaje = signal<number>(20);
  gano = signal<boolean>(false);
  failedAttempts: WritableSignal<number> = signal(5);

  keyboard = viewChild(KeyboardComponent);

  currentWord: WritableSignal<string> = signal('');
  currentWordIndex: WritableSignal<number> = signal(0);
  imageIndex: WritableSignal<number> = signal(0);

  wordLetters: WritableSignal<string[]> = signal([]);
  wordLettersDisplay: WritableSignal<string[]> = signal([]);

  imageSrc: Signal<string> = computed(
    () => `assets/juegos/ahorcado/ahorcado-${this.imageIndex()}.png`,
  );

  constructor() {
    addIcons({
      heart,
      heartOutline,
      pricetagOutline,
      timeOutline,
      starOutline,
      alertCircleOutline,
      closeCircleOutline,
      playCircleOutline,
      checkmarkCircleOutline,
      warningOutline,
    });
  }

  ionViewWillEnter() {
    this.resetState();
  }

  ionViewWillLeave() {
    if (this.juegoEmpezado()) {
      this.stop();
    }
  }

  start(): void {
    this.juegoEmpezado.set(true);
    this.juegoTerminado.set(false);
    this.setCurrentWord();
  }

  stop(): void {
    this.juegoTerminado.set(true);
    this.juegoEmpezado.set(false);

    if (this.manejador.primeraVez()) {
      this.manejador.descuento.set(this.porcentaje());
      this.manejador.primeraVez.set(false);
    }
  }

  onLetterGuessed(letter: string): void {
    if (this.currentWord().includes(letter)) {
      this.wordLetters.update((prev) => prev.filter((l) => l !== letter));

      if (this.wordLetters().length === 0) {
        this.gano.set(true);
        this.stop();
      }
    } else {
      this.failedAttempts.update((prev) => prev - 1);
      this.imageIndex.update((prev) => prev + 1);
      if (this.failedAttempts() === 2) {
        this.porcentaje.set(15);
      } else if (this.failedAttempts() === 1) {
        this.porcentaje.set(10);
      } else if (this.failedAttempts() < 1) {
        this.porcentaje.set(0);
        this.stop();
      }
    }
  }

  private setCurrentWord(): void {
    const letters = this.currentWord().split('');
    this.wordLetters.set(letters);
    this.wordLettersDisplay.set(letters);
  }

  private resetState(): void {
    this.currentWordIndex.set(0);
    this.failedAttempts.set(5);
    this.imageIndex.set(0);
    this.wordLetters.set([]);
    this.wordLettersDisplay.set([]);
    this.porcentaje.set(20);
    this.currentWord.set(this.getRandomWord());
    this.gano.set(false);
  }

  private getRandomWord(): string {
    return hamburguesaWords[
      Math.floor(Math.random() * hamburguesaWords.length)
    ];
  }

  reiniciarJuego() {
    this.resetState();
    this.start();
  }
}
const hamburguesaWords: string[] = [
  'HAMBURGUESA',
  'CARNE',
  'QUESO',
  'LECHUGA',
  'TOMATE',
  'CEBOLLA',
  'PEPINO',
  'MOSTAZA',
  'KETCHUP',
  'MAYONESA',
  'PANCETA',
  'JAMON',
  'PAN',
  'BRIOCHE',
  'INTEGRAL',
  'PARRILLA',
  'PLANCHA',
  'AHUMADO',
  'JUGOSO',
  'CRUJIENTE',
  'DOBLE',
  'TRIPLE',
  'CLASICA',
  'VEGANA',
  'POLLO',
  'PESCADO',
  'CHEDDAR',
  'MOZZARELLA',
  'BRIE',
  'GOUDA',
  'PEPINILLO',
  'AGUACATE',
  'SALSA',
  'ADEREZO',
  'ALIOLI',
  'PAPAS',
  'FRITAS',
  'AROS',
  'ENSALADA',
  'COMBO',
  'MENU',
  'ANGUS',
  'GOURMET',
  'ARTESANAL',
  'GRATINADA',
  'PARRILLA',
];
