import { Component, OnInit, output, signal, WritableSignal } from '@angular/core';
import { IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-keyboard',
  templateUrl: './keyboard.component.html',
  styleUrls: ['./keyboard.component.scss'],
  imports: [IonButton]
})
export class KeyboardComponent {
  letterGuessed = output<string>();
  usedLetters: WritableSignal<Set<string>> = signal(new Set());

  letters = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];

  guess(letter: string) {
    if(this.usedLetters().has(letter)) return;

    this.usedLetters.update(prev => new Set(prev).add(letter));
    this.letterGuessed.emit(letter);
  }

  reset() {
    this.usedLetters.set(new Set());
  }
}
