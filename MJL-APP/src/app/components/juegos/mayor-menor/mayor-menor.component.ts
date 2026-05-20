import { Component, inject, signal } from '@angular/core';
import { ViewWillEnter } from '@ionic/angular/standalone';
import { ManejadorJuegos } from 'src/app/services/manejador-juegos';
import { MayorMenorService } from 'src/app/services/MayorMenorService';
import {
  IonButton,
  IonIcon,
  IonContent,
} from '@ionic/angular/standalone';
import { LayoutComponent } from 'src/app/components/layout/layout.component';
import { addIcons } from 'ionicons';
import {
  arrowUpOutline,
  arrowDownOutline,
  heartOutline,
  heart,
  trophyOutline,
  reloadOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-mayor-menor',
  templateUrl: './mayor-menor.component.html',
  styleUrls: ['./mayor-menor.component.scss'],
  imports: [IonButton, IonIcon, IonContent, LayoutComponent],
})
export class MayorMenorComponent implements ViewWillEnter {
  mmService = inject(MayorMenorService);
  manejador = inject(ManejadorJuegos);

  srcImgIncognita = signal<string>(this.mmService.getSrcCardIncognit());
  srcImgSiguiente = signal<string>(this.srcImgIncognita());
  srcImgActual = signal<string>('');
  numeroCartaJugador = signal<number>(0);
  numeroCartaPC = signal<number>(0);

  juegoEmpezado = signal<boolean>(false);
  juegoTerminado = signal<boolean>(false);

  rondaFinal = signal(false);
  private timeoutId: ReturnType<typeof setTimeout> | null = null;

  cantidadDeVidas = signal<number>(3);
  cantidadDeTurnos = signal<number>(0);
  aciertos = signal<number>(0);
  esMenor = signal<boolean>(false);

  gano = signal<boolean>(false);

  pcRevelada = signal(false);
  resultadoRonda = signal<'win' | 'lose' | null>(null);

  constructor() {
    addIcons({
      arrowUpOutline,
      arrowDownOutline,
      heartOutline,
      heart,
      trophyOutline,
      reloadOutline,
    });
  }

  ionViewWillEnter(): void {
    this.reiniciarJuego();
  }

  async nuevaCartaJugador() {
    const carta = await this.mmService.getCardPlayer();
    this.srcImgActual.set(carta.src);
    this.numeroCartaJugador.set(carta.numberCard);
  }

  async nuevaCartaPC() {
    const carta = await this.mmService.getCardComputer(
      this.numeroCartaJugador(),
    );
    this.srcImgSiguiente.set(carta.src);
    this.numeroCartaPC.set(carta.numberCard);
  }

  chequearResultado(): boolean {
    const resultadoFavorableOpcion1 =
      !this.esMenor() && this.numeroCartaJugador() < this.numeroCartaPC();
    const resultadoFavorableOpcion2 =
      this.esMenor() && this.numeroCartaJugador() > this.numeroCartaPC();

    if (resultadoFavorableOpcion1 || resultadoFavorableOpcion2) {
      this.aciertos.set(this.aciertos() + 1);
      return true;
    }
    this.cantidadDeVidas.set(this.cantidadDeVidas() - 1);
    return false;
  }

  cargarImgIncognita() {
    this.srcImgSiguiente.set(this.srcImgIncognita());
  }

  chequearEstadoDelJuego(): boolean {
    if (this.aciertos() === 5 || this.cantidadDeVidas() === 0) {
      this.gano.set(this.aciertos() === 5);
      if (this.gano() && this.manejador.primeraVez()) {
        this.manejador.tieneDescuento.set(true);
      }
      this.manejador.primeraVez.set(false);
      return true;
    }
    return false;
  }

  empezarJuego() {
    this.juegoEmpezado.set(true);
    this.nuevaCartaJugador();
  }

  async elegir(esMenor: boolean) {
    if (this.pcRevelada()) return;
    this.esMenor.set(esMenor);
    this.cantidadDeTurnos.set(this.cantidadDeTurnos() + 1);
    await this.mostrarCartaPC();
    this.pcRevelada.set(true);
    this.jugar();
  }

  proximaRonda() {
    this.pcRevelada.set(false);
    this.resultadoRonda.set(null);
    this.cargarImgIncognita();
    this.nuevaCartaJugador();
  }

  async mostrarCartaPC() {
    await this.nuevaCartaPC();
  }

  jugar() {
    const resultado = this.chequearResultado();
    this.resultadoRonda.set(resultado ? 'win' : 'lose');
    if (this.chequearEstadoDelJuego()) {
      this.rondaFinal.set(true);
      this.timeoutId = setTimeout(() => {
        this.juegoTerminado.set(true);
        this.timeoutId = null;
      }, 2000);
    }
  }

  reiniciarJuego() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    this.juegoEmpezado.set(false);
    this.juegoTerminado.set(false);
    this.rondaFinal.set(false);
    this.cantidadDeVidas.set(3);
    this.cantidadDeTurnos.set(0);
    this.aciertos.set(0);
    this.gano.set(false);
    this.pcRevelada.set(false);
    this.resultadoRonda.set(null);
    this.cargarImgIncognita();
    this.mmService.resetListCard();
  }
}
