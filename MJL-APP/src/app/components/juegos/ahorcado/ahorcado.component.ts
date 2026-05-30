import { Component, computed, inject, OnInit, Signal, signal, viewChild, WritableSignal } from '@angular/core';
import { IonLabel, ViewWillEnter } from '@ionic/angular/standalone';
import { ManejadorJuegos } from 'src/app/services/manejador-juegos';
import { IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonList, IonIcon, IonButton, IonItem } from '@ionic/angular/standalone';
import { LayoutComponent } from 'src/app/components/layout/layout.component';
import { KeyboardComponent } from './keyboard/keyboard.component';
import { alertCircleOutline, checkmarkCircleOutline, closeCircleOutline, playCircleOutline, starOutline, timeOutline, warningOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { ConstantPool } from '@angular/compiler';


@Component({
  selector: 'app-ahorcado',
  templateUrl: './ahorcado.component.html',
  styleUrls: ['./ahorcado.component.scss'],
  imports: [
    IonCard, IonCardContent, IonItem, IonLabel, IonCardHeader, IonCardTitle, IonCardSubtitle, IonContent, IonList, IonButton, IonIcon, LayoutComponent, KeyboardComponent
  ]
})
export class AhorcadoComponent  implements ViewWillEnter {
  manejador = inject(ManejadorJuegos);
  juegoEmpezado = signal<boolean>(false);
  juegoTerminado = signal<boolean>(false);
  porcentaje = signal<number>(20);
  gano = signal<boolean>(false);
  failedAttempts: WritableSignal<number> = signal(0);

  attempts: WritableSignal<number> = signal(0);

  keyboard = viewChild(KeyboardComponent);

  currentWordArray: WritableSignal<string[]> = signal([]);
  currentWordIndex: WritableSignal<number> = signal(0);
  imageIndex: WritableSignal<number> = signal(0);
 
  wordLetters: WritableSignal<string[]> = signal([]);
  wordLettersDisplay: WritableSignal<string[]> = signal([]);


  imageSrc: Signal<string> = computed(
    () => `assets/juegos/ahorcado/ahorcado-${this.imageIndex()}.png`
  );
 
  word: Signal<string> = computed(
    () => this.currentWordArray()[this.currentWordIndex()] ?? ''
  );
 
 
  manejadorJuegos = inject(ManejadorJuegos);

  constructor() { 
    addIcons({
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
    if(this.juegoEmpezado()) {
      this.stop();
    }
  }

  start(): void {
    this.juegoEmpezado.set(true);
    this.porcentaje.set(20);
    this.attempts.set(0);
    this.imageIndex.set(0);
    this.currentWordIndex.set(0);
    this.currentWordArray.set(this.getRandomWords());
    this.setCurrentWord();
  }
 
  stop(): void {
    this.juegoEmpezado.set(false);
 
    if (this.porcentaje() > 0) {
      console.log("Tiene descuento")
    }
    this.resetState();
  }
 
  onLetterGuessed(letter: string): void {
    this.attempts.update((prev) => prev + 1);
    if (this.word().includes(letter)) {
      this.wordLetters.update((prev) => prev.filter((l) => l !== letter));
 
      if (this.wordLetters().length === 0) {
        this.gano.set(true);
        this.nextWord();
      }
    } else {
      this.failedAttempts.update((prev) => prev + 1)
      this.imageIndex.update((prev) => Math.min(prev + 1, 5)); // cap at last image
      if(this.failedAttempts() === 3) {
        this.porcentaje.set(15);
      } else if(this.failedAttempts() === 4) {
        this.porcentaje.set(10);
      } else if (this.failedAttempts() > 4 ) {
        this.porcentaje.set(0);
        this.juegoEmpezado.set(false);
        this.juegoTerminado.set(true);
      }
    }
    console.log("attempts:", this.attempts())
    console.log("failed attempts:", this.failedAttempts())
  }

    private nextWord(): void {
    const nextIndex = this.currentWordIndex() + 1;
    this.keyboard()?.reset();
    this.attempts.set(0);
    this.imageIndex.set(0);
 
    if (nextIndex < this.currentWordArray().length) {
      this.currentWordIndex.set(nextIndex);
      this.setCurrentWord();
    } else {
      // Bonus for clearing all words
      this.stop();
    }
  }
 
  private setCurrentWord(): void {
    // word() is a computed that depends on currentWordIndex — reads it after setting
    const letters = this.word().split('');
    this.wordLetters.set(letters);
    this.wordLettersDisplay.set(letters);
  }
 
  private resetState(): void {
    this.currentWordIndex.set(0);
    this.attempts.set(0);
    this.imageIndex.set(0);
    this.wordLetters.set([]);
    this.wordLettersDisplay.set([]);
  }
 
  private getRandomWords(): string[] {
    return [...hamburguesaWords].sort(() => Math.random() - 0.5).slice(0, 5);
  }
 
  private async sendScoreToDB(): Promise<void> {
    const game = 'ahorcado';
  }

  reiniciarJuego () {}
    
}
const hamburguesaWords: string[] = [
  'HAMBURGUESA', 'CARNE', 'QUESO', 'LECHUGA', 'TOMATE',
  'CEBOLLA', 'PEPINO', 'MOSTAZA', 'KETCHUP', 'MAYONESA',
  'PANCETA', 'JAMON', 'PAN', 'BRIOCHE', 'INTEGRAL',
  'PARRILLA', 'PLANCHA', 'AHUMADO', 'JUGOSO', 'CRUJIENTE',
  'DOBLE', 'TRIPLE', 'CLASICA', 'VEGANA', 'POLLO',
  'PESCADO', 'CHEDDAR', 'MOZZARELLA', 'BRIE', 'GOUDA',
  'PEPINILLO', 'AGUACATE', 'SALSA', 'ADEREZO', 'ALIOLI',
  'PAPAS', 'FRITAS', 'AROS', 'ENSALADA',
  'COMBO', 'MENU', 'ANGUS','GOURMET', 'ARTESANAL', 'GRATINADA', 'PARRILLA'
];

