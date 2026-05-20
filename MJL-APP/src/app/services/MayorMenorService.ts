import { Injectable } from '@angular/core';
import { ICard } from '../interfaces/icard';

@Injectable({
  providedIn: 'root',
})
export class MayorMenorService {
  private cardsList: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  private cardListWithOutExtremes: number[] = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

  getCardPlayer(): Promise<ICard> {
    return new Promise((resolve) => {
      const numberCard =
        this.cardListWithOutExtremes[
          Math.floor(Math.random() * this.cardListWithOutExtremes.length)
        ];
      const src = `assets/juegos/matias/card-${numberCard}.jpg`;
      resolve({
        numberCard: numberCard,
        src: src,
      });
    });
  }

  getCardComputer(filter: number): Promise<ICard> {
    return new Promise((resolve) => {
      const listFilter = this.cardsList.filter((card) => card !== filter);
      const number = listFilter[Math.floor(Math.random() * listFilter.length)];
      const src = `assets/juegos/matias/card-${number}.jpg`;
      this.resetListCard();
      resolve({
        numberCard: number,
        src: src,
      });
    });
  }

  getSrcCardIncognit(): string {
    return `assets/juegos/matias/card-incognit.jpg`;
  }

  resetListCard(): void {
    this.cardsList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  }
}
