import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ManejadorJuegos {

  primeraVez = signal<boolean>(true);
  descuento = signal<number>(0);
  
}
