import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ManejadorJuegos {

  primeraVez = signal<boolean>(true);
  tieneDescuento = signal<boolean>(false);
  
}
