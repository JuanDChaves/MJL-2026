import { Component, computed, inject, OnInit, Signal, signal, viewChild, WritableSignal } from '@angular/core';
import { IonLabel, ViewWillEnter } from '@ionic/angular/standalone';
import { ManejadorJuegos } from 'src/app/services/manejador-juegos';
import { IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonList, IonIcon, IonButton, IonItem } from '@ionic/angular/standalone';
import { LayoutComponent } from 'src/app/components/layout/layout.component';
import { KeyboardComponent } from './keyboard/keyboard.component';
import { alertCircleOutline, checkmarkCircleOutline, closeCircleOutline, playCircleOutline, starOutline, timeOutline, warningOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';


@Component({
  selector: 'app-ahorcado',
  templateUrl: './ahorcado.component.html',
  styleUrls: ['./ahorcado.component.scss'],
  imports: [
    IonCard, IonCardContent, IonItem, IonLabel, IonCardHeader, IonCardTitle, IonCardSubtitle, IonContent, IonList, IonButton, IonIcon, LayoutComponent, KeyboardComponent
  ]
})
export class AhorcadoComponent  implements ViewWillEnter {
  //authService = inject(AuthService);
  //scoreRecordService = inject(ScoreRecordService);
  //timeService = inject(TimeService);
  //navCtrl = inject(NavController);


  isPlaying: WritableSignal<boolean> = signal(false);
  timeLeft: WritableSignal<number> = signal(60);
  currentScore: WritableSignal<number> = signal(0);
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
 
 
  private intervalId: ReturnType<typeof setInterval> | null = null;
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
    if(this.isPlaying()) {
      this.stop();
    }
  }

  ngOnDestroy(): void {
    this.clearInterval();
  }

  start(): void {
    this.isPlaying.set(true);
    this.timeLeft.set(60);
    this.currentScore.set(0);
    this.attempts.set(0);
    this.imageIndex.set(0);
    this.currentWordIndex.set(0);
    this.currentWordArray.set(this.getRandomWords());
    //this.timeService.startClock();
    this.setCurrentWord();
    //this.startTimer();
  }
 
  stop(): void {
    this.clearInterval();
    //this.timeService.stopClock();
    this.isPlaying.set(false);
 
    if (this.currentScore() > 0) {
      //this.sendScoreToDB();
    }
 
    this.resetState();
  }
 
  onLetterGuessed(letter: string): void {
    this.attempts.update((prev) => prev + 1);
 
    if (this.word().includes(letter)) {
      this.wordLetters.update((prev) => prev.filter((l) => l !== letter));
      this.currentScore.update((prev) => prev + 500);
 
      if (this.wordLetters().length === 0) {
        this.currentScore.update((prev) => prev + 2000);
        this.nextWord();
      }
    } else {
      if (this.attempts() > 5 && this.currentScore() > 0) {
        this.currentScore.update((prev) => prev - 200);
      }
      this.imageIndex.update((prev) => Math.min(prev + 1, 6)); // cap at last image
    }
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
      this.currentScore.update((prev) => prev + 5000);
      this.stop();
    }
  }
 
  private setCurrentWord(): void {
    // word() is a computed that depends on currentWordIndex — reads it after setting
    const letters = this.word().split('');
    this.wordLetters.set(letters);
    this.wordLettersDisplay.set(letters);
  }
 
  private startTimer(): void {
    this.clearInterval();
    this.intervalId = setInterval(() => {
      //const elapsed = this.timeService.getTimeElapsed() ?? 0;
      const elapsed = 0
      const remaining = 60 - elapsed;
 
      if (remaining <= 0) {
        this.timeLeft.set(0);
        this.stop();
      } else {
        this.timeLeft.set(remaining);
      }
    }, 1000);
  }
 
  private clearInterval(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
 
  private resetState(): void {
    this.currentWordIndex.set(0);
    this.attempts.set(0);
    this.currentScore.set(0);
    this.imageIndex.set(0);
    this.wordLetters.set([]);
    this.wordLettersDisplay.set([]);
  }
 
  private getRandomWords(): string[] {
    return [...hamburguesaWords].sort(() => Math.random() - 0.5).slice(0, 5);
  }
 
  private async sendScoreToDB(): Promise<void> {
    //const user = this.authService.currentUser()?.user_metadata?.['nombre'] ?? 'Unknown';
    const score = this.currentScore();
    const game = 'ahorcado';
    //await this.scoreRecordService.insertMessage(user, score, game);
  }
  
    
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

