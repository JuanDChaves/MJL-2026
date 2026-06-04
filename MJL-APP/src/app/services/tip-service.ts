import { Injectable, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class TipService {
  private tip = signal<number>(0);
  tip$ = toObservable(this.tip);

  setTip(tip: number) {
    this.tip.set(tip);
  }
}
