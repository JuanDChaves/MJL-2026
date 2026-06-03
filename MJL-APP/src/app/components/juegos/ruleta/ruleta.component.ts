import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ManejadorJuegos } from 'src/app/services/manejador-juegos';
import { UserService } from 'src/app/services/user-service';
import { IonButton, IonContent, ViewWillEnter } from '@ionic/angular/standalone';
@Component({
  selector: 'app-ruleta',
  templateUrl: './ruleta.component.html',
  styleUrls: ['./ruleta.component.scss'],
  imports:[IonContent, IonButton],
  standalone: true
})
export class RuletaComponent implements ViewWillEnter {
  manejadorJuegos = inject(ManejadorJuegos);
  userService = inject(UserService);
  router = inject(Router);

  girando = false;
  rotacionActual = 0;
  resultadoMensaje = 'Toca el botón para girar';
  descuentoGanado = 0;
  mostrarResultado = false;
  esAnonimo = false;

  ionViewWillEnter() {
    // Verificamos si es anónimo para cumplir la consigna: "(anónimo NO)"
    const user = this.userService.userData();
    this.esAnonimo = user!.dni === null;
  }

  girarRuleta() {
    if (this.girando) return;

    this.girando = true;
    this.mostrarResultado = false;
    this.resultadoMensaje = '¡Girando...!';

    const probabilidad = Math.random() * 100;
    
    let gradosPremio = 0;
    let premioValor = 0;

    // MATEMÁTICA CORREGIDA PARA QUE COINCIDA CON LA FLECHA SUPERIOR
    if (probabilidad <= 10) {
      premioValor = 20;
      gradosPremio = 315; // Ángulo para que el 20% quede arriba
    } else if (probabilidad <= 30) {
      premioValor = 15;
      gradosPremio = 225; // Ángulo para que el 15% quede arriba
    } else if (probabilidad <= 60) {
      premioValor = 10;
      gradosPremio = 135; // Ángulo para que el 10% quede arriba
    } else {
      premioValor = 0;
      gradosPremio = 45;  // Ángulo para que "Nada" quede arriba
    }

    const premioReal = this.esAnonimo ? 0 : premioValor;

    // Variación para que no frene siempre en el mismo milímetro (entre -30 y +30 grados)
    const variacionAleatoria = Math.floor(Math.random() * 60) - 30; 
    
    // Calculamos las vueltas completas basadas en dónde quedó la ruleta la última vez
    const baseVueltas = Math.floor(this.rotacionActual / 360) * 360;
    const vueltasExtra = 360 * 5; // 5 giros completos de emoción

    // Asignamos la posición final absoluta
    this.rotacionActual = baseVueltas + vueltasExtra + gradosPremio + variacionAleatoria;

    setTimeout(() => {
      this.finalizarGiro(premioValor, premioReal);
    }, 4000);
  }

  finalizarGiro(premioVisual: number, premioReal: number) {
    this.girando = false;
    this.mostrarResultado = true;
    this.descuentoGanado = premioReal;

    if (this.esAnonimo) {
      this.resultadoMensaje = premioVisual > 0 
        ? `¡Salió el ${premioVisual}%! Pero recordá que los descuentos son exclusivos para clientes registrados.` 
        : `¡Qué lástima! No hubo descuento. (Regístrate la próxima vez para participar).`;
      return;
    }

    // Regla de un solo descuento en el primer intento global (cliente registrado)
    if (this.manejadorJuegos.primeraVez()) {
      this.manejadorJuegos.primeraVez.set(false); 

      if (premioReal > 0) {
        this.resultadoMensaje = `¡Felicidades! Ganaste un ${premioReal}% de descuento en tu cuenta.`;
        this.manejadorJuegos.descuento.set(premioReal);
        // Acá guardarás el descuento en el ticket final
      } else {
        this.resultadoMensaje = `¡Ups! La suerte no te acompañó. ¡Pero podes seguir jugando por diversión!`;
      }
    } else {
      // Intentos posteriores
      this.resultadoMensaje = premioVisual > 0 
        ? `¡Salió el ${premioVisual}%! (Modo diversión: solo cuenta el primer intento de la estadía).`
        : `Sin premio. ¡Seguí jugando por diversión!`;
    }
  }

  volver() {
    this.router.navigate(['/ingreso-local-cliente']);
  }
}